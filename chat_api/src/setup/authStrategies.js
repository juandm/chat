const { ExtractJwt, Strategy } = require('passport-jwt');

function createAuthStrategies({ userRepository }) {
  function jwtAuthStrategy() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    };

    const jwtStrategy = new Strategy(opts, async (jwtPayload, next) => {
      console.log('UserID in token:', jwtPayload.sub);
      try {
        const user = await userRepository.getByUserId(jwtPayload.sub);
        if (user) {
          return next(null, { id: user.id });
        }
        // User not found
        return next(null, false);
      } catch (error) {
        return next(error, null);
      }
    });

    return jwtStrategy;
  }

  function loadAuthStrategies() {
    const jwtStrategy = jwtAuthStrategy();
    return { jwt: jwtStrategy };
  }

  return { loadAuthStrategies };
}

module.exports = createAuthStrategies;
