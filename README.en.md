# udes1gn-auth2 - OIDC Authentication Server + Client Backend + Resource Server

`udes1gn-auth2` is a third-party authentication service built with NestJS, designed to provide secure and flexible OAuth 2.0 authentication. It allows clients (such as web applications and mobile apps) to register, authenticate users, and manage access tokens. The service supports multiple authentication flows, including Authorization Code Flow and Client Credentials Flow, ensuring seamless integration with various applications.

## Architecture

|                | auth-service (Authentication Server) | client-service (Client)   | resource-service (Resource Server) |
| -------------- | ------------------------------------ | ------------------------- | --------------------------------- |
| domain         | auth.udes1gn.com                    | client.udes1gn.com        | api.udes1gn.com                  |
| port           | 8101                                 | 8102                      | 8103                             |
| Symmetric Mode | ✅                                   |                           | ✅                                |
| Asymmetric Mode| ✅                                   |                           | ✅                                |
| Functionality  | register user, register client, login | getUserInfo, refresh token | verify token, main business logic |
