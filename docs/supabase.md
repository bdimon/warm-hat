# Установить текущую метку времени (отметить как подтверждённый сейчас)
```SQL
UPDATE auth.users
SET email_confirmed_at = now()
WHERE id = '<user-uuid>';
```
# Убрать подтверждение (сделать NULL):
```SQL
UPDATE auth.users
SET email_confirmed_at = NULL
WHERE id = '<user-uuid>';
```
## Замените на UUID пользователя.
## Если хотите установить конкретную дату/время, используйте: TIMESTAMP '2025-11-09 12:00:00' вместо now().

# Команда — устанавливаем текущее время в поле email_confirmed_at:
```bash

curl -X PATCH "https://<PROJECT_REF>.supabase.co/auth/v1/admin/users/<USER_ID>" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email_confirmed_at":"2025-11-09T12:00:00Z"}'
  ```
  
   <PROJECT_REF> — ваш project ref (из URL в Dashboard).
   <SERVICE_ROLE_KEY> — ваш service_role ключ (никогда не храните в клиенте).
   <USER_ID> — UUID пользователя.
   При желании замените timestamp на нужный.

# Чтобы снять подтверждение, отправьте "email_confirmed_at": null:


































