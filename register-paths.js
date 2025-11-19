const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Configurar tsconfig-paths para producción
// Las rutas deben resolverse desde el directorio build/
tsConfigPaths.register({
  baseUrl: path.resolve(__dirname, './build'),
  paths: {
    '@models/*': ['database/models/*'],
    '@models': ['database/models'],
    '@errors/*': ['api/lib/errors/*'],
    '@errors': ['api/lib/errors'],
    '@logs/*': ['api/lib/logs/*'],
    '@logs': ['api/lib/logs'],
    '@envs/*': ['api/lib/environment/*'],
    '@envs': ['api/lib/environment'],
    '@middlewares/*': ['api/lib/middlewares/*'],
    '@middlewares': ['api/lib/middlewares'],
    '@services/*': ['api/services/*'],
    '@services': ['api/services'],
    '@utils/*': ['api/lib/utils/*'],
    '@utils': ['api/lib/utils'],
    '@routes/*': ['api/routes/*'],
    '@routes': ['api/routes/*'],
  },
});
