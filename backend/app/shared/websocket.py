"""
WebSocket connection manager for real-time updates.
"""
from typing import Dict, Set
from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections for broadcasting updates."""

    def __init__(self):
        # Topic -> set of connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, topic: str = "products"):
        """Accept and track a new WebSocket connection."""
        await websocket.accept()
        if topic not in self.active_connections:
            self.active_connections[topic] = set()
        self.active_connections[topic].add(websocket)

    def disconnect(self, websocket: WebSocket, topic: str = "products"):
        """Remove a WebSocket connection."""
        if topic in self.active_connections:
            self.active_connections[topic].discard(websocket)

    async def broadcast(self, message: dict, topic: str = "products"):
        """Broadcast a message to all connections on a topic."""
        if topic not in self.active_connections:
            return
        
        disconnected = set()
        for connection in self.active_connections[topic]:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        # Clean up disconnected
        for conn in disconnected:
            self.active_connections[topic].discard(conn)


# Global connection manager instance
manager = ConnectionManager()
