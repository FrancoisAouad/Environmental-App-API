import authController from './auth/auth.controller';
import App from './app';
import './lib/db/mongoCon';
import './lib/db/redisCon';

const app = new App([new authController()]);

app.listen();
