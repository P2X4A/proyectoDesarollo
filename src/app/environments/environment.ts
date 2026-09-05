/**
 * Configuración centralizada de APIs externas.
 * Vive en `src/app/environments/` junto al resto de la app.
 * La API key de OMDb vive aquí (no hardcodeada en los services),
 * igual que las URLs base.
 */
export const environment = {
  production: false,
  omdbBaseUrl: 'https://www.omdbapi.com',
  omdbApiKey: 'a9bad909',
  fakeStoreBaseUrl: 'https://fakestoreapi.com/products',
};
