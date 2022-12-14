import authController from './auth/auth.controller';
import adminController from './admin/admin.controller';
import postController from './posts/post.controller';
import App from './app';
import './lib/db/mongoCon';
// import './lib/db/redisCon';

const app = new App([
    new authController(),
    new adminController(),
    new postController(),
]);

app.listen();
