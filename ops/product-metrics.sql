SELECT
  COUNT(DISTINCT CASE WHEN name = 'visited' THEN session_hash END) AS users,
  COUNT(DISTINCT CASE WHEN name = 'selected' THEN session_hash END) AS selected,
  COUNT(DISTINCT CASE WHEN name = 'filled' THEN session_hash END) AS filled,
  COUNT(DISTINCT CASE WHEN name = 'copied' THEN session_hash END) AS copied,
  COUNT(DISTINCT CASE WHEN name = 'saved' THEN session_hash END) AS saved,
  COUNT(DISTINCT CASE WHEN name = 'exported' THEN session_hash END) AS exported,
  COUNT(DISTINCT CASE WHEN name = 'returned' THEN session_hash END) AS returned,
  COUNT(DISTINCT CASE WHEN name = 'visited' AND occurred_on >= date('now', '-6 days') THEN session_hash END) AS users_7d,
  COUNT(DISTINCT CASE WHEN name = 'copied' AND occurred_on >= date('now', '-6 days') THEN session_hash END) AS copied_7d
FROM product_events;
