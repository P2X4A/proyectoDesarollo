/**
 * Configuración centralizada de APIs externas.
 * La API key de OMDb vive aquí (no hardcodeada en el service),
 * igual que las URLs base. Para producción usa environment.prod.
 */
export const environment = {
  production: false,
  omdbBaseUrl: 'https://www.omdbapi.com',
  omdbApiKey: 'a9bad909',
  fakeStoreBaseUrl: 'https://fakestoreapi.com/products',
};
