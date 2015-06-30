<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\WebSocketHandler;

use Doctrine\ORM\EntityManager;
use Exception;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use AppBundle\Entity\User;

/**
 * Description of Chat
 *
 * @author paddya
 */
class Chat implements MessageComponentInterface {

	protected $clients;
	/**
	 * @var EntityManager
	 */
	protected $em;
	
	/**
	 * Constructor
	 *
	 * @param EntityManager $em
	 */
	public function __construct(EntityManager $em) {
		$this->clients = [];
		$this->em = $em;
	}
	
	private function ensureDatabaseConnection() {
		if ($this->em->getConnection()->ping() === false) {
			$this->em->getConnection()->close();
			$this->em->getConnection()->connect();
		}
	}

	public function onOpen(ConnectionInterface $conn) {
		$username = $conn->WebSocket->request->getQuery()->get('username');
		// Store the new connection to send messages to later
		$this->clients[$conn->resourceId] = $conn;
		$conn->send(json_encode(['type' => 'welcome']));
		echo "New connection! ({$conn->resourceId})\n";
		
		$this->updateClientLists();
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$numRecv = count($this->clients);
		echo sprintf('Connection %d sending message "%s" to %d connection%s' . "\n"
				, $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

		foreach ($this->clients as $client) {
			$client->send(json_encode(['type' => 'message', 'msg' => $msg]));
		}
	}

	public function onClose(ConnectionInterface $conn) {
		// The connection is closed, remove it, as we can no longer send it messages
		unset($this->clients[$conn->resourceId]);

		$this->updateClientLists();

		echo "Connection {$conn->resourceId} has disconnected\n";
	}

	public function onError(ConnectionInterface $conn, Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";

		$conn->close();
	}

	private function getClientIdList() {
		return array_keys($this->clients);
	}

	private function updateClientLists() {
		// Update number of open connections on clients
		foreach ($this->clients as $client) {
			dump($client->resourceId);
			$client->send(json_encode(['type' => 'clientList', 'clients' => $this->getClientIdList()]));
			dump($client->resourceId);
		}
	}

}
