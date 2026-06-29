## What does this PR do?

<!-- Brief description of the change -->

## Type of change

- [ ] New agent / command / rule
- [ ] Change to an existing agent / command / rule
- [ ] Hook or scaffolder (`bin/`, `hooks/`, `scripts/`) change
- [ ] Docs only

## Checklist

- [ ] `node scripts/validate-skills.mjs templates/agents templates/commands` passes
- [ ] New/changed agents keep **least-privilege** tools (reviewers are read-only)
- [ ] Hooks remain **fail-open** (no path can brick a session)
- [ ] README / scaffold tree updated if I added or removed a template
- [ ] Tested by running `node bin/init.mjs` into a throwaway directory
