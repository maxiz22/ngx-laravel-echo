import * as pusher from 'pusher-js';
import * as io from 'socket.io-client';

export interface Config {
  /**
   * Authentication information for the underlying connector
   */
  auth?: {
    /**
     * Headers to be included with the request
     */
    headers?: { [key: string]: any };
    params?: { [key: string]: any };
  };
  /**
   * The authentication endpoint
   */
  authEndpoint?: string;
  /**
   * The broadcaster to use
   */
  broadcaster?: 'socket.io' | 'pusher' | 'null';
  /**
   * The application CSRF token
   */
  csrfToken?: string | null;
  /**
   * The namespace to use for events
   */
  namespace?: string;
}

export interface NullConfig extends Config {
  broadcaster: 'null';
}

export interface PusherConfig extends Config, pusher.Config {
  broadcaster?: 'pusher';

  /**
   * A pusher client instance to use
   */
  client?: pusher.Pusher;
  /**
   * The pusher host to connect to
   */
  host?: string | null;
  /**
   * The pusher auth key
   */
  key?: string | null;
}

export interface SocketIoConfig extends Config, SocketIOClient.ConnectOpts {
  broadcaster: 'socket.io';

  /**
   * A reference to the socket.io client to use
   */
  client?: SocketIOClientStatic;

  /**
   * The url of the laravel echo server instance
   */
  host: string;
}

export interface Connector {
  /**
   * All of the subscribed channel names.
   */
  channels: any;

  /**
   * Connector options.
   */
  options: Config;

  /**
   * Create a new export interface instance.
   *
   * @param {Config} options
   * @returns {Connector}
   */
  new(options: Config): Connector;

  /**
   * Create a fresh connection.
   */
  connect(): void;

  /**
   * Listen for an event on a channel instance.
   *
   * @param {string} name
   * @param {string} event
   * @param {pusher.EventCallback} callback
   * @returns {PusherChannel}
   */
  listen(name: string, event: string, callback: (event: any) => void): Channel;

  /**
   * Get a channel instance by name.
   *
   * @param {string} channel
   * @returns {Channel}
   */
  channel(channel: string): Channel;

  /**
   * Get a private channel instance by name.
   *
   * @param {string} channel
   * @returns {PrivateChannel}
   */
  privateChannel(channel: string): PrivateChannel;

  /**
   * Get a presence channel instance by name.
   *
   * @param {string} channel
   * @returns {PresenceChannel}
   */
  presenceChannel(channel: string): PresenceChannel;

  /**
   * Leave the given channel.
   *
   * @param {string} channel
   */
  leave(channel: string): void;

  /**
   * Get the socket_id of the connection.
   *
   * @returns {string}
   */
  socketId(): string;

  /**
   * Disconnect from the Echo server.
   */
  disconnect(): void;
}

export interface NullConnector extends Connector {
  /**
   * Create a new export interface instance.
   *
   * @param {NullConfig} options
   * @returns {NullConnector}
   */
  new(options: NullConfig): Connector;

  /**
   * Listen for an event on a channel instance.
   *
   * @param {string} name
   * @param {string} event
   * @param {pusher.EventCallback} callback
   * @returns {PusherChannel}
   */
  listen(name: string, event: string, callback: pusher.EventCallback): NullChannel;

  /**
   * Get a channel instance by name.
   *
   * @param {string} name
   * @returns {PusherChannel}
   */
  channel(name: string): NullChannel;

  /**
   * Get a private channel instance by name.
   *
   * @param {string} name
   * @returns {PusherPrivateChannel}
   */
  privateChannel(name: string): NullPrivateChannel;

  /**
   * Get a presence channel instance by name.
   *
   * @param {string} name
   * @returns {PusherPresenceChannel}
   */
  presenceChannel(name: string): NullPresenceChannel;
}

export interface PusherConnector extends Connector {
  /**
   * The Pusher instance.
   */
  pusher: pusher.Pusher;

  /**
   * Create a new export interface instance.
   *
   * @param {PusherConfig} options
   * @returns {PusherConnector}
   */
  new(options: PusherConfig): Connector;

  /**
   * Listen for an event on a channel instance.
   *
   * @param {string} name
   * @param {string} event
   * @param {pusher.EventCallback} callback
   * @returns {PusherChannel}
   */
  listen(name: string, event: string, callback: pusher.EventCallback): PusherChannel;

  /**
   * Get a channel instance by name.
   *
   * @param {string} name
   * @returns {PusherChannel}
   */
  channel(name: string): PusherChannel;

  /**
   * Get a private channel instance by name.
   *
   * @param {string} name
   * @returns {PusherPrivateChannel}
   */
  privateChannel(name: string): PusherPrivateChannel;

  /**
   * Get a presence channel instance by name.
   *
   * @param {string} name
   * @returns {PusherPresenceChannel}
   */
  presenceChannel(name: string): PusherPresenceChannel;
}

export interface SocketIoConnector extends Connector {
  /**
   * The Socket.io connection instance.
   */
  socket: SocketIOClient.Socket;

  /**
   * Create a new export interface instance.
   *
   * @param {SocketIoConfig} options
   * @returns {SocketIoConnector}
   */
  new(options: SocketIoConfig): Connector;

  /**
   * Get socket.io module from global scope or options.
   *
   * @returns {typeof io}
   */
  getSocketIO(): SocketIOClientStatic;

  /**
   * Listen for an event on a channel instance.
   *
   * @param {string} name
   * @param {string} event
   * @param {(event: any) => void} callback
   * @returns {SocketIoChannel}
   */
  listen(name: string, event: string, callback: (event: any) => void): SocketIoChannel;

  /**
   * Get a channel instance by name.
   *
   * @param {string} name
   * @returns {SocketIoChannel}
   */
  channel(name: string): SocketIoChannel;

  /**
   * Get a private channel instance by name.
   *
   * @param {string} name
   * @returns {SocketIoPrivateChannel}
   */
  privateChannel(name: string): SocketIoPrivateChannel;

  /**
   * Get a presence channel instance by name.
   *
   * @param {string} name
   * @returns {SocketIoPresenceChannel}
   */
  presenceChannel(name: string): SocketIoPresenceChannel;
}

export interface Channel {
  /**
   * The name of the channel.
   */
  name: string;

  /**
   * Channel options.
   */
  options: any;

  /**
   * The event formatter.
   */
  eventFormatter: EventFormatter;

  /**
   * Listen for an event on the channel instance.
   *
   * @param {string} event
   * @param {(event: any) => void} callback
   * @returns {Channel}
   */
  listen(event: string, callback: (event: any) => void): Channel;

  /**
   * Listen for a notification on the channel instance.
   *
   * @param {(notification: any) => void} callback
   * @returns {Channel}
   */
  notification(callback: (notification: any) => void): Channel;

  /**
   * Listen for a whisper event on the channel instance.
   *
   * @param {string} event
   * @param {(data: any) => void} callback
   * @returns {Channel}
   */
  listenForWhisper(event: string, callback: (data: any) => void): Channel;
}

export interface PrivateChannel extends Channel {
  /**
   * Trigger client event on the channel.
   *
   * @param {string} event
   * @param data
   * @returns {PrivateChannel}
   */
  whisper(event: string, data: any): PrivateChannel;
}

export interface PresenceChannel extends PrivateChannel {
  /**
   * Register a callback to be called anytime the member list changes.
   *
   * @param {(users: any[]) => void} callback
   * @returns {PresenceChannel}
   */
  here(callback: (users: any[]) => void): PresenceChannel;

  /**
   * Listen for someone joining the channel.
   *
   * @param {(user: any) => void} callback
   * @returns {PresenceChannel}
   */
  joining(callback: (user: any) => void): PresenceChannel;

  /**
   * Listen for someone leaving the channel.
   *
   * @param {(user: any) => void} callback
   * @returns {PresenceChannel}
   */
  leaving(callback: (user: any) => void): PresenceChannel;
}

export interface NullChannel extends Channel {
  /**
   * Subscribe to a Null channel.
   */
  subscribe(): void;

  /**
   * Unsubscribe from a Null channel.
   */
  unsubscribe(): void;

  /**
   * Stop listening for an event on the channel instance.
   *
   * @param {string} event
   * @returns {NullChannel}
   */
  stopListening(event: string): Channel;

  /**
   * Bind a channel to an event.
   *
   * @param {string} event
   * @param {Null.EventCallback} callback
   * @returns {NullChannel}
   */
  on(event: string, callback: pusher.EventCallback): Channel;
}

export interface NullPrivateChannel extends NullChannel, PrivateChannel {
}

export interface NullPresenceChannel extends NullPrivateChannel, PresenceChannel {
}

export interface PusherChannel extends Channel {
  /**
   * The pusher client instance
   */
  pusher: pusher.Pusher;

  /**
   * The subscription of the channel.
   */
  subscription: pusher.Channel;

  /**
   * Create a new export interface instance.
   *
   * @param {pusher} pusher
   * @param {string} name
   * @param options
   * @returns {PusherChannel}
   */
  new(pusher: pusher.Pusher, name: string, options: any): PusherChannel;

  /**
   * Subscribe to a Pusher channel.
   */
  subscribe(): void;

  /**
   * Unsubscribe from a Pusher channel.
   */
  unsubscribe(): void;

  /**
   * Stop listening for an event on the channel instance.
   *
   * @param {string} event
   * @returns {PusherChannel}
   */
  stopListening(event: string): Channel;

  /**
   * Bind a channel to an event.
   *
   * @param {string} event
   * @param {pusher.EventCallback} callback
   * @returns {PusherChannel}
   */
  on(event: string, callback: pusher.EventCallback): Channel;
}

export interface PusherPrivateChannel extends PusherChannel, PrivateChannel {
}

export interface PusherPresenceChannel extends PusherPrivateChannel, PresenceChannel {
}

export interface SocketIoChannel extends Channel {

  /**
   * The SocketIo client instance
   */
  socket: typeof io;

  /**
   * The event callbacks applied to the channel.
   */
  events: any;

  /**
   * Create a new export interface instance.
   *
   * @param {io} socket
   * @param {string} name
   * @param options
   * @returns {SocketIoChannel}
   */
  new(socket: typeof io, name: string, options: any): SocketIoChannel;

  /**
   * Subscribe to a SocketIo channel.
   */
  subscribe(): void;

  /**
   * Unsubscribe from a SocketIo channel.
   */
  unsubscribe(): void;

  /**
   * Bind a channel to an event.
   *
   * @param {string} event
   * @param {(event: any) => void} callback
   * @returns {SocketIoChannel}
   */
  on(event: string, callback: (event: any) => void): SocketIoChannel;

  /**
   * Attach a 'reconnect' listener and bind the event.
   */
  configureReconnector(): void;

  /**
   * Bind the channel's socket to an event and store the callback.
   *
   * @param {string} event
   * @param {(event: any) => void} callback
   * @returns {SocketIoChannel}
   */
  bind(event: string, callback: (event: any) => void): SocketIoChannel;

  /**
   * Unbind the channel's socket from all stored event callbacks.
   */
  unbind(): void;
}

export interface SocketIoPrivateChannel extends SocketIoChannel, PrivateChannel {
}

export interface SocketIoPresenceChannel extends SocketIoPrivateChannel, PresenceChannel {
}

export interface EventFormatter {
  /**
   * Event namespace.
   */
  namespace: string | boolean;

  /**
   * Create a new export interface instance.
   *
   * @param {string | boolean} namespace
   * @returns {EventFormatter}
   */
  new(namespace: string | boolean): EventFormatter;

  /**
   * Format the given event name.
   *
   * @param {string} event
   * @returns {string}
   */
  format(event: string): string;

  /**
   * Set the event namespace.
   *
   * @param {string | boolean} value
   */
  setNamespace(value: string | boolean): void;
}
