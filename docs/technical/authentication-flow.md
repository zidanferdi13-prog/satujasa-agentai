# Authentication Flow

## Strategy

Session-based authentication dengan httpOnly cookie untuk access + JWT refresh token.

## Why Session + JWT Refresh?

- httpOnly cookie: tidak accessible via JavaScript → aman dari XSS
- Refresh token: memungkinkan silent renewal tanpa re-login
- No localStorage tokens: mengurangi attack surface

## Registration Flow (Owner)

```
Client                          Server
  │                               │
  │  POST /auth/register          │
  │  {name, email, phone, pass}   │
  │──────────────────────────────►│
  │                               │  - Validate input (Zod)
  │                               │  - Check email uniqueness
  │                               │  - Hash password (bcrypt, 12 rounds)
  │                               │  - Create user (role: owner)
  │                               │  - Create subscription (tier: free)
  │                               │  - Generate session + refresh token
  │  201 + Set-Cookie             │
  │◄──────────────────────────────│
```

## Login Flow

```
Client                          Server
  │                               │
  │  POST /auth/login             │
  │  {email, password}            │
  │──────────────────────────────►│
  │                               │  - Find user by email
  │                               │  - Verify password (bcrypt compare)
  │                               │  - Check user status (active)
  │                               │  - Generate session ID
  │                               │  - Generate refresh token (JWT, 7d)
  │  200 + Set-Cookie(session)    │
  │◄──────────────────────────────│
```

## Session Cookie Details

```
Set-Cookie: session=<session_id>;
  HttpOnly;
  Secure;
  SameSite=Strict;
  Path=/;
  Max-Age=3600  (1 hour)
```

## Refresh Flow

```
Client                          Server
  │                               │
  │  POST /auth/refresh           │
  │  Cookie: refresh=<jwt>        │
  │──────────────────────────────►│
  │                               │  - Verify JWT signature
  │                               │  - Check token not revoked
  │                               │  - Generate new session
  │  200 + new Set-Cookie         │
  │◄──────────────────────────────│
```

## Token Specifications

| Token | Storage | Lifetime | Content |
|-------|---------|----------|---------|
| Session | httpOnly cookie | 1 hour | session ID (opaque) |
| Refresh | httpOnly cookie | 7 days | JWT (user_id, role, iat, exp) |

## Auth Middleware Logic

```typescript
async function authMiddleware(req, res, next) {
  const sessionId = req.cookies.session;
  
  if (!sessionId) {
    return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });
  }

  const session = await getSession(sessionId);
  
  if (!session || session.expired) {
    return res.status(401).json({ error: { code: 'SESSION_EXPIRED' } });
  }

  req.user = session.user; // { id, role, owner_id, tenant_id }
  next();
}
```

## RBAC Middleware Logic

```typescript
function requireRole(...roles: UserRole[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }
    next();
  };
}
```

## Tenant Isolation Middleware

```typescript
function tenantIsolation(req, res, next) {
  if (req.user.role === 'super-admin') {
    req.tenantFilter = null; // no filter
  } else if (req.user.role === 'owner') {
    req.ownerFilter = req.user.id;
  } else if (req.user.role === 'admin-user') {
    req.tenantFilter = req.user.tenant_id;
  }
  next();
}
```

## Mobile Auth (Expo)

- Same API endpoints as web
- Refresh token stored in Expo SecureStore (encrypted device storage)
- Axios interceptor handles automatic token refresh on 401
- On refresh failure → redirect to login screen

## Security Considerations

1. Password: bcrypt with 12 salt rounds
2. Rate limiting: max 5 login attempts per IP per 15 minutes
3. Session invalidation: logout clears all sessions for user
4. Refresh rotation: new refresh token issued on each refresh (old one revoked)
5. CORS: only allowed origins can send credentialed requests
