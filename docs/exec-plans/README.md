# Execution Plans

Use execution plans for multi-step changes that need durable progress, decisions, or recovery context.

- `active/` contains in-progress plans.
- `completed/` contains finished plans that remain useful history.

Small changes can continue to use lightweight in-conversation plans. Production-readiness work that spans multiple files, tasks, or verification loops should get a checked-in plan.
