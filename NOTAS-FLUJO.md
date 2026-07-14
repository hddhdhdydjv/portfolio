# Notas de flujo — Portfolio (hddhdhdydjv.com)

## Reglas acordadas

- **`main` = producción.** Es lo que está live en hddhdhdydjv.com. No se toca sin pedirlo.
- **Todos los ajustes y pruebas van en la rama `claude/portfolio-repo-review-ryuzmf`.**
- **Nada se mergea a `main` ni se deployea sin autorización explícita.**
- **El sync de Framer (`sync-framer.mjs`) NO se corre solo.** Solo trae cambios de Framer
  al sitio si alguien lo ejecuta a mano. Nunca se corre sin pedirlo.

## Cómo llegan (o no) los cambios de Framer al sitio

Editar en Framer NO afecta el portfolio live. El sync es 100% manual.

```
Framer (loving-slides-198460.framer.app)   <- editás libre, no afecta nada
            |
            |  SOLO si se corre a mano: node sync-framer.mjs
            v
   Repo (baja HTML -> commit -> push -> vercel deploy)
            |
            v
   hddhdhdydjv.com  (LIVE)
```

No hay automatización que dispare esto:
- Sin GitHub Actions (no existe carpeta `.github`).
- Sin `package.json` (sin hooks/scripts npm).
- Sin `vercel.json` en el repo (sin build automático).

## Dónde pedir cambios y pruebas

Rama de trabajo: **`claude/portfolio-repo-review-ryuzmf`**

Acá se hacen los ajustes, se prueban, y recién cuando se aprueba se mergea a `main`.
