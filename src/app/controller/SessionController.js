import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(401).json({ error: 'email not found' });
        }
        if (!user.verifyPassword(req.body.password)) {
            return res.status(401).json({ error: 'passwords does not match' });
        }
        const { id, name, email, password } = user;
        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        });
        return res.json({
            id,
            name,
            email,
            password,
            token,
        });
    }
}

export default new SessionController();
