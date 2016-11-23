(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var Hook = Package['callback-hook'].Hook;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Accounts, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-base":{"server_main.js":["./accounts_server.js","./accounts_rate_limit.js","./url_server.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/server_main.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsServer:function(){return AccountsServer}});var AccountsServer;module.import("./accounts_server.js",{"AccountsServer":function(v){AccountsServer=v}});module.import("./accounts_rate_limit.js");module.import("./url_server.js");
                                                                                                                   // 2
                                                                                                                   // 3
                                                                                                                   //
/**                                                                                                                //
 * @namespace Accounts                                                                                             //
 * @summary The namespace for all server-side accounts-related methods.                                            //
 */                                                                                                                //
Accounts = new AccountsServer(Meteor.server);                                                                      // 9
                                                                                                                   //
// Users table. Don't use the normal autopublish, since we want to hide                                            //
// some fields. Code to autopublish this is in accounts_server.js.                                                 //
// XXX Allow users to configure this collection name.                                                              //
                                                                                                                   //
/**                                                                                                                //
 * @summary A [Mongo.Collection](#collections) containing user documents.                                          //
 * @locus Anywhere                                                                                                 //
 * @type {Mongo.Collection}                                                                                        //
 * @importFromPackage meteor                                                                                       //
*/                                                                                                                 //
Meteor.users = Accounts.users;                                                                                     // 21
                                                                                                                   //
                                                                                                                   // 23
                                                                                                                   //
                                                                                                                   //
                                                                                                                   //
                                                                                                                   //
                                                                                                                   // 28
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_common.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_common.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsCommon:function(){return AccountsCommon}});var _classCallCheck;module.import("babel-runtime/helpers/classCallCheck",{"default":function(v){_classCallCheck=v}});
/**                                                                                                                //
 * @summary Super-constructor for AccountsClient and AccountsServer.                                               //
 * @locus Anywhere                                                                                                 //
 * @class AccountsCommon                                                                                           //
 * @instancename accountsClientOrServer                                                                            //
 * @param options {Object} an object with fields:                                                                  //
 * - connection {Object} Optional DDP connection to reuse.                                                         //
 * - ddpUrl {String} Optional URL for creating a new DDP connection.                                               //
 */                                                                                                                //
var AccountsCommon = function () {                                                                                 // 10
  function AccountsCommon(options) {                                                                               // 11
    _classCallCheck(this, AccountsCommon);                                                                         // 11
                                                                                                                   //
    // Currently this is read directly by packages like accounts-password                                          //
    // and accounts-ui-unstyled.                                                                                   //
    this._options = {};                                                                                            // 14
                                                                                                                   //
    // Note that setting this.connection = null causes this.users to be a                                          //
    // LocalCollection, which is not what we want.                                                                 //
    this.connection = undefined;                                                                                   // 18
    this._initConnection(options || {});                                                                           // 19
                                                                                                                   //
    // There is an allow call in accounts_server.js that restricts writes to                                       //
    // this collection.                                                                                            //
    this.users = new Mongo.Collection("users", {                                                                   // 23
      _preventAutopublish: true,                                                                                   // 24
      connection: this.connection                                                                                  // 25
    });                                                                                                            // 23
                                                                                                                   //
    // Callback exceptions are printed with Meteor._debug and ignored.                                             //
    this._onLoginHook = new Hook({                                                                                 // 29
      bindEnvironment: false,                                                                                      // 30
      debugPrintExceptions: "onLogin callback"                                                                     // 31
    });                                                                                                            // 29
                                                                                                                   //
    this._onLoginFailureHook = new Hook({                                                                          // 34
      bindEnvironment: false,                                                                                      // 35
      debugPrintExceptions: "onLoginFailure callback"                                                              // 36
    });                                                                                                            // 34
  }                                                                                                                // 38
                                                                                                                   //
  /**                                                                                                              //
   * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                  //
   * @locus Anywhere but publish functions                                                                         //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.userId = function userId() {                                                            // 10
    throw new Error("userId method not implemented");                                                              // 45
  };                                                                                                               // 46
                                                                                                                   //
  /**                                                                                                              //
   * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.              //
   * @locus Anywhere but publish functions                                                                         //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.user = function user() {                                                                // 10
    var userId = this.userId();                                                                                    // 53
    return userId ? this.users.findOne(userId) : null;                                                             // 54
  };                                                                                                               // 55
                                                                                                                   //
  // Set up config for the accounts system. Call this on both the client                                           //
  // and the server.                                                                                               //
  //                                                                                                               //
  // Note that this method gets overridden on AccountsServer.prototype, but                                        //
  // the overriding method calls the overridden method.                                                            //
  //                                                                                                               //
  // XXX we should add some enforcement that this is called on both the                                            //
  // client and the server. Otherwise, a user can                                                                  //
  // 'forbidClientAccountCreation' only on the client and while it looks                                           //
  // like their app is secure, the server will still accept createUser                                             //
  // calls. https://github.com/meteor/meteor/issues/828                                                            //
  //                                                                                                               //
  // @param options {Object} an object with fields:                                                                //
  // - sendVerificationEmail {Boolean}                                                                             //
  //     Send email address verification emails to new users created from                                          //
  //     client signups.                                                                                           //
  // - forbidClientAccountCreation {Boolean}                                                                       //
  //     Do not allow clients to create accounts directly.                                                         //
  // - restrictCreationByEmailDomain {Function or String}                                                          //
  //     Require created users to have an email matching the function or                                           //
  //     having the string as domain.                                                                              //
  // - loginExpirationInDays {Number}                                                                              //
  //     Number of days since login until a user is logged out (login token                                        //
  //     expires).                                                                                                 //
                                                                                                                   //
  /**                                                                                                              //
   * @summary Set global accounts options.                                                                         //
   * @locus Anywhere                                                                                               //
   * @param {Object} options                                                                                       //
   * @param {Boolean} options.sendVerificationEmail New users with an email address will receive an address verification email.
   * @param {Boolean} options.forbidClientAccountCreation Calls to [`createUser`](#accounts_createuser) from the client will be rejected. In addition, if you are using [accounts-ui](#accountsui), the "Create account" link will not be available.
   * @param {String | Function} options.restrictCreationByEmailDomain If set to a string, only allows new users if the domain part of their email address matches the string. If set to a function, only allows new users if the function returns true.  The function is passed the full email address of the proposed new user.  Works with password-based sign-in and external services that expose email addresses (Google, Facebook, GitHub). All existing users still can log in after enabling this option. Example: `Accounts.config({ restrictCreationByEmailDomain: 'school.edu' })`.
   * @param {Number} options.loginExpirationInDays The number of days from when a user logs in until their token expires and they are logged out. Defaults to 90. Set to `null` to disable login expiration.
   * @param {String} options.oauthSecretKey When using the `oauth-encryption` package, the 16 byte key using to encrypt sensitive account credentials in the database, encoded in base64.  This option may only be specifed on the server.  See packages/oauth-encryption/README.md for details.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.config = function config(options) {                                                     // 10
    var self = this;                                                                                               // 93
                                                                                                                   //
    // We don't want users to accidentally only call Accounts.config on the                                        //
    // client, where some of the options will have partial effects (eg removing                                    //
    // the "create account" button from accounts-ui if forbidClientAccountCreation                                 //
    // is set, or redirecting Google login to a specific-domain page) without                                      //
    // having their full effects.                                                                                  //
    if (Meteor.isServer) {                                                                                         // 100
      __meteor_runtime_config__.accountsConfigCalled = true;                                                       // 101
    } else if (!__meteor_runtime_config__.accountsConfigCalled) {                                                  // 102
      // XXX would be nice to "crash" the client and replace the UI with an error                                  //
      // message, but there's no trivial way to do this.                                                           //
      Meteor._debug("Accounts.config was called on the client but not on the " + "server; some configuration options may not take effect.");
    }                                                                                                              // 107
                                                                                                                   //
    // We need to validate the oauthSecretKey option at the time                                                   //
    // Accounts.config is called. We also deliberately don't store the                                             //
    // oauthSecretKey in Accounts._options.                                                                        //
    if (_.has(options, "oauthSecretKey")) {                                                                        // 112
      if (Meteor.isClient) throw new Error("The oauthSecretKey option may only be specified on the server");       // 113
      if (!Package["oauth-encryption"]) throw new Error("The oauth-encryption package must be loaded to set oauthSecretKey");
      Package["oauth-encryption"].OAuthEncryption.loadKey(options.oauthSecretKey);                                 // 117
      options = _.omit(options, "oauthSecretKey");                                                                 // 118
    }                                                                                                              // 119
                                                                                                                   //
    // validate option keys                                                                                        //
    var VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation", "restrictCreationByEmailDomain", "loginExpirationInDays"];
    _.each(_.keys(options), function (key) {                                                                       // 124
      if (!_.contains(VALID_KEYS, key)) {                                                                          // 125
        throw new Error("Accounts.config: Invalid key: " + key);                                                   // 126
      }                                                                                                            // 127
    });                                                                                                            // 128
                                                                                                                   //
    // set values in Accounts._options                                                                             //
    _.each(VALID_KEYS, function (key) {                                                                            // 131
      if (key in options) {                                                                                        // 132
        if (key in self._options) {                                                                                // 133
          throw new Error("Can't set `" + key + "` more than once");                                               // 134
        }                                                                                                          // 135
        self._options[key] = options[key];                                                                         // 136
      }                                                                                                            // 137
    });                                                                                                            // 138
  };                                                                                                               // 139
                                                                                                                   //
  /**                                                                                                              //
   * @summary Register a callback to be called after a login attempt succeeds.                                     //
   * @locus Anywhere                                                                                               //
   * @param {Function} func The callback to be called when login is successful.                                    //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.onLogin = function onLogin(func) {                                                      // 10
    return this._onLoginHook.register(func);                                                                       // 147
  };                                                                                                               // 148
                                                                                                                   //
  /**                                                                                                              //
   * @summary Register a callback to be called after a login attempt fails.                                        //
   * @locus Anywhere                                                                                               //
   * @param {Function} func The callback to be called after the login has failed.                                  //
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsCommon.prototype.onLoginFailure = function onLoginFailure(func) {                                        // 10
    return this._onLoginFailureHook.register(func);                                                                // 156
  };                                                                                                               // 157
                                                                                                                   //
  AccountsCommon.prototype._initConnection = function _initConnection(options) {                                   // 10
    if (!Meteor.isClient) {                                                                                        // 160
      return;                                                                                                      // 161
    }                                                                                                              // 162
                                                                                                                   //
    // The connection used by the Accounts system. This is the connection                                          //
    // that will get logged in by Meteor.login(), and this is the                                                  //
    // connection whose login state will be reflected by Meteor.userId().                                          //
    //                                                                                                             //
    // It would be much preferable for this to be in accounts_client.js,                                           //
    // but it has to be here because it's needed to create the                                                     //
    // Meteor.users collection.                                                                                    //
                                                                                                                   //
    if (options.connection) {                                                                                      // 172
      this.connection = options.connection;                                                                        // 173
    } else if (options.ddpUrl) {                                                                                   // 174
      this.connection = DDP.connect(options.ddpUrl);                                                               // 175
    } else if (typeof __meteor_runtime_config__ !== "undefined" && __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL) {
      // Temporary, internal hook to allow the server to point the client                                          //
      // to a different authentication server. This is for a very                                                  //
      // particular use case that comes up when implementing a oauth                                               //
      // server. Unsupported and may go away at any point in time.                                                 //
      //                                                                                                           //
      // We will eventually provide a general way to use account-base                                              //
      // against any DDP connection, not just one special one.                                                     //
      this.connection = DDP.connect(__meteor_runtime_config__.ACCOUNTS_CONNECTION_URL);                            // 185
    } else {                                                                                                       // 187
      this.connection = Meteor.connection;                                                                         // 188
    }                                                                                                              // 189
  };                                                                                                               // 190
                                                                                                                   //
  AccountsCommon.prototype._getTokenLifetimeMs = function _getTokenLifetimeMs() {                                  // 10
    return (this._options.loginExpirationInDays || DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;           // 193
  };                                                                                                               // 195
                                                                                                                   //
  AccountsCommon.prototype._tokenExpiration = function _tokenExpiration(when) {                                    // 10
    // We pass when through the Date constructor for backwards compatibility;                                      //
    // `when` used to be a number.                                                                                 //
    return new Date(new Date(when).getTime() + this._getTokenLifetimeMs());                                        // 200
  };                                                                                                               // 201
                                                                                                                   //
  AccountsCommon.prototype._tokenExpiresSoon = function _tokenExpiresSoon(when) {                                  // 10
    var minLifetimeMs = .1 * this._getTokenLifetimeMs();                                                           // 204
    var minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;                                                     // 205
    if (minLifetimeMs > minLifetimeCapMs) minLifetimeMs = minLifetimeCapMs;                                        // 206
    return new Date() > new Date(when) - minLifetimeMs;                                                            // 208
  };                                                                                                               // 209
                                                                                                                   //
  return AccountsCommon;                                                                                           // 10
}();                                                                                                               // 10
                                                                                                                   //
var Ap = AccountsCommon.prototype;                                                                                 // 212
                                                                                                                   //
// Note that Accounts is defined separately in accounts_client.js and                                              //
// accounts_server.js.                                                                                             //
                                                                                                                   //
/**                                                                                                                //
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                    //
 * @locus Anywhere but publish functions                                                                           //
 * @importFromPackage meteor                                                                                       //
 */                                                                                                                //
Meteor.userId = function () {                                                                                      // 222
  return Accounts.userId();                                                                                        // 223
};                                                                                                                 // 224
                                                                                                                   //
/**                                                                                                                //
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.                //
 * @locus Anywhere but publish functions                                                                           //
 * @importFromPackage meteor                                                                                       //
 */                                                                                                                //
Meteor.user = function () {                                                                                        // 231
  return Accounts.user();                                                                                          // 232
};                                                                                                                 // 233
                                                                                                                   //
// how long (in days) until a login token expires                                                                  //
var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;                                                                            // 236
// Clients don't try to auto-login with a token that is going to expire within                                     //
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.                                      //
// Tries to avoid abrupt disconnects from expiring tokens.                                                         //
var MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour                                                                // 240
// how often (in milliseconds) we check for expired tokens                                                         //
EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000; // 10 minutes                                                              // 242
// how long we wait before logging out clients when Meteor.logoutOtherClients is                                   //
// called                                                                                                          //
CONNECTION_CLOSE_DELAY_MS = 10 * 1000;                                                                             // 245
                                                                                                                   //
// loginServiceConfiguration and ConfigError are maintained for backwards compatibility                            //
Meteor.startup(function () {                                                                                       // 248
  var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                                // 249
  Ap.loginServiceConfiguration = ServiceConfiguration.configurations;                                              // 251
  Ap.ConfigError = ServiceConfiguration.ConfigError;                                                               // 252
});                                                                                                                // 253
                                                                                                                   //
// Thrown when the user cancels the login process (eg, closes an oauth                                             //
// popup, declines retina scan, etc)                                                                               //
var lceName = 'Accounts.LoginCancelledError';                                                                      // 257
Ap.LoginCancelledError = Meteor.makeErrorType(lceName, function (description) {                                    // 258
  this.message = description;                                                                                      // 261
});                                                                                                                // 262
Ap.LoginCancelledError.prototype.name = lceName;                                                                   // 264
                                                                                                                   //
// This is used to transmit specific subclass errors over the wire. We should                                      //
// come up with a more generic way to do this (eg, with some sort of symbolic                                      //
// error code rather than a number).                                                                               //
Ap.LoginCancelledError.numericError = 0x8acdc2f;                                                                   // 269
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_rate_limit.js":["./accounts_common.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_rate_limit.js                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var AccountsCommon;module.import("./accounts_common.js",{"AccountsCommon":function(v){AccountsCommon=v}});         // 1
                                                                                                                   //
var Ap = AccountsCommon.prototype;                                                                                 // 3
var defaultRateLimiterRuleId;                                                                                      // 4
// Removes default rate limiting rule                                                                              //
Ap.removeDefaultRateLimit = function () {                                                                          // 6
  var resp = DDPRateLimiter.removeRule(defaultRateLimiterRuleId);                                                  // 7
  defaultRateLimiterRuleId = null;                                                                                 // 8
  return resp;                                                                                                     // 9
};                                                                                                                 // 10
                                                                                                                   //
// Add a default rule of limiting logins, creating new users and password reset                                    //
// to 5 times every 10 seconds per connection.                                                                     //
Ap.addDefaultRateLimit = function () {                                                                             // 14
  if (!defaultRateLimiterRuleId) {                                                                                 // 15
    defaultRateLimiterRuleId = DDPRateLimiter.addRule({                                                            // 16
      userId: null,                                                                                                // 17
      clientAddress: null,                                                                                         // 18
      type: 'method',                                                                                              // 19
      name: function name(_name) {                                                                                 // 20
        return _.contains(['login', 'createUser', 'resetPassword', 'forgotPassword'], _name);                      // 21
      },                                                                                                           // 23
      connectionId: function connectionId(_connectionId) {                                                         // 24
        return true;                                                                                               // 25
      }                                                                                                            // 26
    }, 5, 10000);                                                                                                  // 16
  }                                                                                                                // 28
};                                                                                                                 // 29
                                                                                                                   //
Ap.addDefaultRateLimit();                                                                                          // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"accounts_server.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","./accounts_common.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/accounts_server.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({AccountsServer:function(){return AccountsServer}});var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});var AccountsCommon;module.import("./accounts_common.js",{"AccountsCommon":function(v){AccountsCommon=v}});
                                                                                                                   //
                                                                                                                   //
var crypto = Npm.require('crypto');                                                                                // 1
                                                                                                                   //
                                                                                                                   // 3
                                                                                                                   //
/**                                                                                                                //
 * @summary Constructor for the `Accounts` namespace on the server.                                                //
 * @locus Server                                                                                                   //
 * @class AccountsServer                                                                                           //
 * @extends AccountsCommon                                                                                         //
 * @instancename accountsServer                                                                                    //
 * @param {Object} server A server object such as `Meteor.server`.                                                 //
 */                                                                                                                //
var AccountsServer = function (_AccountsCommon) {                                                                  // 13
  _inherits(AccountsServer, _AccountsCommon);                                                                      // 13
                                                                                                                   //
  // Note that this constructor is less likely to be instantiated multiple                                         //
  // times than the `AccountsClient` constructor, because a single server                                          //
  // can provide only one set of methods.                                                                          //
                                                                                                                   //
  function AccountsServer(server) {                                                                                // 17
    _classCallCheck(this, AccountsServer);                                                                         // 17
                                                                                                                   //
    var _this = _possibleConstructorReturn(this, _AccountsCommon.call(this));                                      // 17
                                                                                                                   //
    _this._server = server || Meteor.server;                                                                       // 20
    // Set up the server's methods, as if by calling Meteor.methods.                                               //
    _this._initServerMethods();                                                                                    // 22
                                                                                                                   //
    _this._initAccountDataHooks();                                                                                 // 24
                                                                                                                   //
    // If autopublish is on, publish these user fields. Login service                                              //
    // packages (eg accounts-google) add to these by calling                                                       //
    // addAutopublishFields.  Notably, this isn't implemented with multiple                                        //
    // publishes since DDP only merges only across top-level fields, not                                           //
    // subfields (such as 'services.facebook.accessToken')                                                         //
    _this._autopublishFields = {                                                                                   // 31
      loggedInUser: ['profile', 'username', 'emails'],                                                             // 32
      otherUsers: ['profile', 'username']                                                                          // 33
    };                                                                                                             // 31
    _this._initServerPublications();                                                                               // 35
                                                                                                                   //
    // connectionId -> {connection, loginToken}                                                                    //
    _this._accountData = {};                                                                                       // 38
                                                                                                                   //
    // connection id -> observe handle for the login token that this connection is                                 //
    // currently associated with, or a number. The number indicates that we are in                                 //
    // the process of setting up the observe (using a number instead of a single                                   //
    // sentinel allows multiple attempts to set up the observe to identify which                                   //
    // one was theirs).                                                                                            //
    _this._userObservesForConnections = {};                                                                        // 45
    _this._nextUserObserveNumber = 1; // for the number described above.                                           // 46
                                                                                                                   //
    // list of all registered handlers.                                                                            //
    _this._loginHandlers = [];                                                                                     // 49
                                                                                                                   //
    setupUsersCollection(_this.users);                                                                             // 51
    setupDefaultLoginHandlers(_this);                                                                              // 52
    setExpireTokensInterval(_this);                                                                                // 53
                                                                                                                   //
    _this._validateLoginHook = new Hook({ bindEnvironment: false });                                               // 55
    _this._validateNewUserHooks = [defaultValidateNewUserHook.bind(_this)];                                        // 56
                                                                                                                   //
    _this._deleteSavedTokensForAllUsersOnStartup();                                                                // 60
                                                                                                                   //
    _this._skipCaseInsensitiveChecksForTest = {};                                                                  // 62
    return _this;                                                                                                  // 17
  }                                                                                                                // 63
                                                                                                                   //
  ///                                                                                                              //
  /// CURRENT USER                                                                                                 //
  ///                                                                                                              //
                                                                                                                   //
  // @override of "abstract" non-implementation in accounts_common.js                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.userId = function userId() {                                                            // 13
    // This function only works if called inside a method. In theory, it                                           //
    // could also be called from publish statements, since they also                                               //
    // have a userId associated with them. However, given that publish                                             //
    // functions aren't reactive, using any of the infomation from                                                 //
    // Meteor.user() in a publish function will always use the value                                               //
    // from when the function first runs. This is likely not what the                                              //
    // user expects. The way to make this work in a publish is to do                                               //
    // Meteor.find(this.userId).observe and recompute when the user                                                //
    // record changes.                                                                                             //
    var currentInvocation = DDP._CurrentInvocation.get();                                                          // 80
    if (!currentInvocation) throw new Error("Meteor.userId can only be invoked in method calls. Use this.userId in publish functions.");
    return currentInvocation.userId;                                                                               // 83
  };                                                                                                               // 84
                                                                                                                   //
  ///                                                                                                              //
  /// LOGIN HOOKS                                                                                                  //
  ///                                                                                                              //
                                                                                                                   //
  /**                                                                                                              //
   * @summary Validate login attempts.                                                                             //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a login is attempted (either successful or unsuccessful).  A login can be aborted by returning a falsy value or throwing an exception.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.validateLoginAttempt = function validateLoginAttempt(func) {                            // 13
    // Exceptions inside the hook callback are passed up to us.                                                    //
    return this._validateLoginHook.register(func);                                                                 // 97
  };                                                                                                               // 98
                                                                                                                   //
  /**                                                                                                              //
   * @summary Set restrictions on new user creation.                                                               //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a new user is created. Takes the new user object, and returns true to allow the creation or false to abort.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.validateNewUser = function validateNewUser(func) {                                      // 13
    this._validateNewUserHooks.push(func);                                                                         // 106
  };                                                                                                               // 107
                                                                                                                   //
  ///                                                                                                              //
  /// CREATE USER HOOKS                                                                                            //
  ///                                                                                                              //
                                                                                                                   //
  /**                                                                                                              //
   * @summary Customize new user creation.                                                                         //
   * @locus Server                                                                                                 //
   * @param {Function} func Called whenever a new user is created. Return the new user object, or throw an `Error` to abort the creation.
   */                                                                                                              //
                                                                                                                   //
                                                                                                                   //
  AccountsServer.prototype.onCreateUser = function onCreateUser(func) {                                            // 13
    if (this._onCreateUserHook) {                                                                                  // 119
      throw new Error("Can only call onCreateUser once");                                                          // 120
    }                                                                                                              // 121
                                                                                                                   //
    this._onCreateUserHook = func;                                                                                 // 123
  };                                                                                                               // 124
                                                                                                                   //
  return AccountsServer;                                                                                           // 13
}(AccountsCommon);;                                                                                                // 13
                                                                                                                   //
var Ap = AccountsServer.prototype;                                                                                 // 127
                                                                                                                   //
// Give each login hook callback a fresh cloned copy of the attempt                                                //
// object, but don't clone the connection.                                                                         //
//                                                                                                                 //
function cloneAttemptWithConnection(connection, attempt) {                                                         // 132
  var clonedAttempt = EJSON.clone(attempt);                                                                        // 133
  clonedAttempt.connection = connection;                                                                           // 134
  return clonedAttempt;                                                                                            // 135
}                                                                                                                  // 136
                                                                                                                   //
Ap._validateLogin = function (connection, attempt) {                                                               // 138
  this._validateLoginHook.each(function (callback) {                                                               // 139
    var ret;                                                                                                       // 140
    try {                                                                                                          // 141
      ret = callback(cloneAttemptWithConnection(connection, attempt));                                             // 142
    } catch (e) {                                                                                                  // 143
      attempt.allowed = false;                                                                                     // 145
      // XXX this means the last thrown error overrides previous error                                             //
      // messages. Maybe this is surprising to users and we should make                                            //
      // overriding errors more explicit. (see                                                                     //
      // https://github.com/meteor/meteor/issues/1960)                                                             //
      attempt.error = e;                                                                                           // 150
      return true;                                                                                                 // 151
    }                                                                                                              // 152
    if (!ret) {                                                                                                    // 153
      attempt.allowed = false;                                                                                     // 154
      // don't override a specific error provided by a previous                                                    //
      // validator or the initial attempt (eg "incorrect password").                                               //
      if (!attempt.error) attempt.error = new Meteor.Error(403, "Login forbidden");                                // 157
    }                                                                                                              // 159
    return true;                                                                                                   // 160
  });                                                                                                              // 161
};                                                                                                                 // 162
                                                                                                                   //
Ap._successfulLogin = function (connection, attempt) {                                                             // 165
  this._onLoginHook.each(function (callback) {                                                                     // 166
    callback(cloneAttemptWithConnection(connection, attempt));                                                     // 167
    return true;                                                                                                   // 168
  });                                                                                                              // 169
};                                                                                                                 // 170
                                                                                                                   //
Ap._failedLogin = function (connection, attempt) {                                                                 // 172
  this._onLoginFailureHook.each(function (callback) {                                                              // 173
    callback(cloneAttemptWithConnection(connection, attempt));                                                     // 174
    return true;                                                                                                   // 175
  });                                                                                                              // 176
};                                                                                                                 // 177
                                                                                                                   //
///                                                                                                                //
/// LOGIN METHODS                                                                                                  //
///                                                                                                                //
                                                                                                                   //
// Login methods return to the client an object containing these                                                   //
// fields when the user was logged in successfully:                                                                //
//                                                                                                                 //
//   id: userId                                                                                                    //
//   token: *                                                                                                      //
//   tokenExpires: *                                                                                               //
//                                                                                                                 //
// tokenExpires is optional and intends to provide a hint to the                                                   //
// client as to when the token will expire. If not provided, the                                                   //
// client will call Accounts._tokenExpiration, passing it the date                                                 //
// that it received the token.                                                                                     //
//                                                                                                                 //
// The login method will throw an error back to the client if the user                                             //
// failed to log in.                                                                                               //
//                                                                                                                 //
//                                                                                                                 //
// Login handlers and service specific login methods such as                                                       //
// `createUser` internally return a `result` object containing these                                               //
// fields:                                                                                                         //
//                                                                                                                 //
//   type:                                                                                                         //
//     optional string; the service name, overrides the handler                                                    //
//     default if present.                                                                                         //
//                                                                                                                 //
//   error:                                                                                                        //
//     exception; if the user is not allowed to login, the reason why.                                             //
//                                                                                                                 //
//   userId:                                                                                                       //
//     string; the user id of the user attempting to login (if                                                     //
//     known), required for an allowed login.                                                                      //
//                                                                                                                 //
//   options:                                                                                                      //
//     optional object merged into the result returned by the login                                                //
//     method; used by HAMK from SRP.                                                                              //
//                                                                                                                 //
//   stampedLoginToken:                                                                                            //
//     optional object with `token` and `when` indicating the login                                                //
//     token is already present in the database, returned by the                                                   //
//     "resume" login handler.                                                                                     //
//                                                                                                                 //
// For convenience, login methods can also throw an exception, which                                               //
// is converted into an {error} result.  However, if the id of the                                                 //
// user attempting the login is known, a {userId, error} result should                                             //
// be returned instead since the user id is not captured when an                                                   //
// exception is thrown.                                                                                            //
//                                                                                                                 //
// This internal `result` object is automatically converted into the                                               //
// public {id, token, tokenExpires} object returned to the client.                                                 //
                                                                                                                   //
// Try a login method, converting thrown exceptions into an {error}                                                //
// result.  The `type` argument is a default, inserted into the result                                             //
// object if not explicitly returned.                                                                              //
//                                                                                                                 //
var tryLoginMethod = function tryLoginMethod(type, fn) {                                                           // 238
  var result;                                                                                                      // 239
  try {                                                                                                            // 240
    result = fn();                                                                                                 // 241
  } catch (e) {                                                                                                    // 242
    result = { error: e };                                                                                         // 244
  }                                                                                                                // 245
                                                                                                                   //
  if (result && !result.type && type) result.type = type;                                                          // 247
                                                                                                                   //
  return result;                                                                                                   // 250
};                                                                                                                 // 251
                                                                                                                   //
// Log in a user on a connection.                                                                                  //
//                                                                                                                 //
// We use the method invocation to set the user id on the connection,                                              //
// not the connection object directly. setUserId is tied to methods to                                             //
// enforce clear ordering of method application (using wait methods on                                             //
// the client, and a no setUserId after unblock restriction on the                                                 //
// server)                                                                                                         //
//                                                                                                                 //
// The `stampedLoginToken` parameter is optional.  When present, it                                                //
// indicates that the login token has already been inserted into the                                               //
// database and doesn't need to be inserted again.  (It's used by the                                              //
// "resume" login handler).                                                                                        //
Ap._loginUser = function (methodInvocation, userId, stampedLoginToken) {                                           // 266
  var self = this;                                                                                                 // 267
                                                                                                                   //
  if (!stampedLoginToken) {                                                                                        // 269
    stampedLoginToken = self._generateStampedLoginToken();                                                         // 270
    self._insertLoginToken(userId, stampedLoginToken);                                                             // 271
  }                                                                                                                // 272
                                                                                                                   //
  // This order (and the avoidance of yields) is important to make                                                 //
  // sure that when publish functions are rerun, they see a                                                        //
  // consistent view of the world: the userId is set and matches                                                   //
  // the login token on the connection (not that there is                                                          //
  // currently a public API for reading the login token on a                                                       //
  // connection).                                                                                                  //
  Meteor._noYieldsAllowed(function () {                                                                            // 280
    self._setLoginToken(userId, methodInvocation.connection, self._hashLoginToken(stampedLoginToken.token));       // 281
  });                                                                                                              // 286
                                                                                                                   //
  methodInvocation.setUserId(userId);                                                                              // 288
                                                                                                                   //
  return {                                                                                                         // 290
    id: userId,                                                                                                    // 291
    token: stampedLoginToken.token,                                                                                // 292
    tokenExpires: self._tokenExpiration(stampedLoginToken.when)                                                    // 293
  };                                                                                                               // 290
};                                                                                                                 // 295
                                                                                                                   //
// After a login method has completed, call the login hooks.  Note                                                 //
// that `attemptLogin` is called for *all* login attempts, even ones                                               //
// which aren't successful (such as an invalid password, etc).                                                     //
//                                                                                                                 //
// If the login is allowed and isn't aborted by a validate login hook                                              //
// callback, log in the user.                                                                                      //
//                                                                                                                 //
Ap._attemptLogin = function (methodInvocation, methodName, methodArgs, result) {                                   // 305
  if (!result) throw new Error("result is required");                                                              // 311
                                                                                                                   //
  // XXX A programming error in a login handler can lead to this occuring, and                                     //
  // then we don't call onLogin or onLoginFailure callbacks. Should                                                //
  // tryLoginMethod catch this case and turn it into an error?                                                     //
  if (!result.userId && !result.error) throw new Error("A login method must specify a userId or an error");        // 317
                                                                                                                   //
  var user;                                                                                                        // 320
  if (result.userId) user = this.users.findOne(result.userId);                                                     // 321
                                                                                                                   //
  var attempt = {                                                                                                  // 324
    type: result.type || "unknown",                                                                                // 325
    allowed: !!(result.userId && !result.error),                                                                   // 326
    methodName: methodName,                                                                                        // 327
    methodArguments: _.toArray(methodArgs)                                                                         // 328
  };                                                                                                               // 324
  if (result.error) attempt.error = result.error;                                                                  // 330
  if (user) attempt.user = user;                                                                                   // 332
                                                                                                                   //
  // _validateLogin may mutate `attempt` by adding an error and changing allowed                                   //
  // to false, but that's the only change it can make (and the user's callbacks                                    //
  // only get a clone of `attempt`).                                                                               //
  this._validateLogin(methodInvocation.connection, attempt);                                                       // 338
                                                                                                                   //
  if (attempt.allowed) {                                                                                           // 340
    var ret = _.extend(this._loginUser(methodInvocation, result.userId, result.stampedLoginToken), result.options || {});
    this._successfulLogin(methodInvocation.connection, attempt);                                                   // 349
    return ret;                                                                                                    // 350
  } else {                                                                                                         // 351
    this._failedLogin(methodInvocation.connection, attempt);                                                       // 353
    throw attempt.error;                                                                                           // 354
  }                                                                                                                // 355
};                                                                                                                 // 356
                                                                                                                   //
// All service specific login methods should go through this function.                                             //
// Ensure that thrown exceptions are caught and that login hook                                                    //
// callbacks are still called.                                                                                     //
//                                                                                                                 //
Ap._loginMethod = function (methodInvocation, methodName, methodArgs, type, fn) {                                  // 363
  return this._attemptLogin(methodInvocation, methodName, methodArgs, tryLoginMethod(type, fn));                   // 370
};                                                                                                                 // 376
                                                                                                                   //
// Report a login attempt failed outside the context of a normal login                                             //
// method. This is for use in the case where there is a multi-step login                                           //
// procedure (eg SRP based password login). If a method early in the                                               //
// chain fails, it should call this function to report a failure. There                                            //
// is no corresponding method for a successful login; methods that can                                             //
// succeed at logging a user in should always be actual login methods                                              //
// (using either Accounts._loginMethod or Accounts.registerLoginHandler).                                          //
Ap._reportLoginFailure = function (methodInvocation, methodName, methodArgs, result) {                             // 386
  var attempt = {                                                                                                  // 392
    type: result.type || "unknown",                                                                                // 393
    allowed: false,                                                                                                // 394
    error: result.error,                                                                                           // 395
    methodName: methodName,                                                                                        // 396
    methodArguments: _.toArray(methodArgs)                                                                         // 397
  };                                                                                                               // 392
                                                                                                                   //
  if (result.userId) {                                                                                             // 400
    attempt.user = this.users.findOne(result.userId);                                                              // 401
  }                                                                                                                // 402
                                                                                                                   //
  this._validateLogin(methodInvocation.connection, attempt);                                                       // 404
  this._failedLogin(methodInvocation.connection, attempt);                                                         // 405
                                                                                                                   //
  // _validateLogin may mutate attempt to set a new error message. Return                                          //
  // the modified version.                                                                                         //
  return attempt;                                                                                                  // 409
};                                                                                                                 // 410
                                                                                                                   //
///                                                                                                                //
/// LOGIN HANDLERS                                                                                                 //
///                                                                                                                //
                                                                                                                   //
// The main entry point for auth packages to hook in to login.                                                     //
//                                                                                                                 //
// A login handler is a login method which can return `undefined` to                                               //
// indicate that the login request is not handled by this handler.                                                 //
//                                                                                                                 //
// @param name {String} Optional.  The service name, used by default                                               //
// if a specific service name isn't returned in the result.                                                        //
//                                                                                                                 //
// @param handler {Function} A function that receives an options object                                            //
// (as passed as an argument to the `login` method) and returns one of:                                            //
// - `undefined`, meaning don't handle;                                                                            //
// - a login method result object                                                                                  //
                                                                                                                   //
Ap.registerLoginHandler = function (name, handler) {                                                               // 430
  if (!handler) {                                                                                                  // 431
    handler = name;                                                                                                // 432
    name = null;                                                                                                   // 433
  }                                                                                                                // 434
                                                                                                                   //
  this._loginHandlers.push({                                                                                       // 436
    name: name,                                                                                                    // 437
    handler: handler                                                                                               // 438
  });                                                                                                              // 436
};                                                                                                                 // 440
                                                                                                                   //
// Checks a user's credentials against all the registered login                                                    //
// handlers, and returns a login token if the credentials are valid. It                                            //
// is like the login method, except that it doesn't set the logged-in                                              //
// user on the connection. Throws a Meteor.Error if logging in fails,                                              //
// including the case where none of the login handlers handled the login                                           //
// request. Otherwise, returns {id: userId, token: *, tokenExpires: *}.                                            //
//                                                                                                                 //
// For example, if you want to login with a plaintext password, `options` could be                                 //
//   { user: { username: <username> }, password: <password> }, or                                                  //
//   { user: { email: <email> }, password: <password> }.                                                           //
                                                                                                                   //
// Try all of the registered login handlers until one of them doesn't                                              //
// return `undefined`, meaning it handled this call to `login`. Return                                             //
// that return value.                                                                                              //
Ap._runLoginHandlers = function (methodInvocation, options) {                                                      // 457
  for (var i = 0; i < this._loginHandlers.length; ++i) {                                                           // 458
    var handler = this._loginHandlers[i];                                                                          // 459
                                                                                                                   //
    var result = tryLoginMethod(handler.name, function () {                                                        // 461
      return handler.handler.call(methodInvocation, options);                                                      // 464
    });                                                                                                            // 465
                                                                                                                   //
    if (result) {                                                                                                  // 468
      return result;                                                                                               // 469
    }                                                                                                              // 470
                                                                                                                   //
    if (result !== undefined) {                                                                                    // 472
      throw new Meteor.Error(400, "A login handler should return a result or undefined");                          // 473
    }                                                                                                              // 474
  }                                                                                                                // 475
                                                                                                                   //
  return {                                                                                                         // 477
    type: null,                                                                                                    // 478
    error: new Meteor.Error(400, "Unrecognized options for login request")                                         // 479
  };                                                                                                               // 477
};                                                                                                                 // 481
                                                                                                                   //
// Deletes the given loginToken from the database.                                                                 //
//                                                                                                                 //
// For new-style hashed token, this will cause all connections                                                     //
// associated with the token to be closed.                                                                         //
//                                                                                                                 //
// Any connections associated with old-style unhashed tokens will be                                               //
// in the process of becoming associated with hashed tokens and then                                               //
// they'll get closed.                                                                                             //
Ap.destroyToken = function (userId, loginToken) {                                                                  // 491
  this.users.update(userId, {                                                                                      // 492
    $pull: {                                                                                                       // 493
      "services.resume.loginTokens": {                                                                             // 494
        $or: [{ hashedToken: loginToken }, { token: loginToken }]                                                  // 495
      }                                                                                                            // 494
    }                                                                                                              // 493
  });                                                                                                              // 492
};                                                                                                                 // 502
                                                                                                                   //
Ap._initServerMethods = function () {                                                                              // 504
  // The methods created in this function need to be created here so that                                          //
  // this variable is available in their scope.                                                                    //
  var accounts = this;                                                                                             // 507
                                                                                                                   //
  // This object will be populated with methods and then passed to                                                 //
  // accounts._server.methods further below.                                                                       //
  var methods = {};                                                                                                // 511
                                                                                                                   //
  // @returns {Object|null}                                                                                        //
  //   If successful, returns {token: reconnectToken, id: userId}                                                  //
  //   If unsuccessful (for example, if the user closed the oauth login popup),                                    //
  //     throws an error describing the reason                                                                     //
  methods.login = function (options) {                                                                             // 517
    var self = this;                                                                                               // 518
                                                                                                                   //
    // Login handlers should really also check whatever field they look at in                                      //
    // options, but we don't enforce it.                                                                           //
    check(options, Object);                                                                                        // 522
                                                                                                                   //
    var result = accounts._runLoginHandlers(self, options);                                                        // 524
                                                                                                                   //
    return accounts._attemptLogin(self, "login", arguments, result);                                               // 526
  };                                                                                                               // 527
                                                                                                                   //
  methods.logout = function () {                                                                                   // 529
    var token = accounts._getLoginToken(this.connection.id);                                                       // 530
    accounts._setLoginToken(this.userId, this.connection, null);                                                   // 531
    if (token && this.userId) accounts.destroyToken(this.userId, token);                                           // 532
    this.setUserId(null);                                                                                          // 534
  };                                                                                                               // 535
                                                                                                                   //
  // Delete all the current user's tokens and close all open connections logged                                    //
  // in as this user. Returns a fresh new login token that this client can                                         //
  // use. Tests set Accounts._noConnectionCloseDelayForTest to delete tokens                                       //
  // immediately instead of using a delay.                                                                         //
  //                                                                                                               //
  // XXX COMPAT WITH 0.7.2                                                                                         //
  // This single `logoutOtherClients` method has been replaced with two                                            //
  // methods, one that you call to get a new token, and another that you                                           //
  // call to remove all tokens except your own. The new design allows                                              //
  // clients to know when other clients have actually been logged                                                  //
  // out. (The `logoutOtherClients` method guarantees the caller that                                              //
  // the other clients will be logged out at some point, but makes no                                              //
  // guarantees about when.) This method is left in for backwards                                                  //
  // compatibility, especially since application code might be calling                                             //
  // this method directly.                                                                                         //
  //                                                                                                               //
  // @returns {Object} Object with token and tokenExpires keys.                                                    //
  methods.logoutOtherClients = function () {                                                                       // 554
    var self = this;                                                                                               // 555
    var user = accounts.users.findOne(self.userId, {                                                               // 556
      fields: {                                                                                                    // 557
        "services.resume.loginTokens": true                                                                        // 558
      }                                                                                                            // 557
    });                                                                                                            // 556
    if (user) {                                                                                                    // 561
      // Save the current tokens in the database to be deleted in                                                  //
      // CONNECTION_CLOSE_DELAY_MS ms. This gives other connections in the                                         //
      // caller's browser time to find the fresh token in localStorage. We save                                    //
      // the tokens in the database in case we crash before actually deleting                                      //
      // them.                                                                                                     //
      var tokens = user.services.resume.loginTokens;                                                               // 567
      var newToken = accounts._generateStampedLoginToken();                                                        // 568
      var userId = self.userId;                                                                                    // 569
      accounts.users.update(userId, {                                                                              // 570
        $set: {                                                                                                    // 571
          "services.resume.loginTokensToDelete": tokens,                                                           // 572
          "services.resume.haveLoginTokensToDelete": true                                                          // 573
        },                                                                                                         // 571
        $push: { "services.resume.loginTokens": accounts._hashStampedToken(newToken) }                             // 575
      });                                                                                                          // 570
      Meteor.setTimeout(function () {                                                                              // 577
        // The observe on Meteor.users will take care of closing the connections                                   //
        // associated with `tokens`.                                                                               //
        accounts._deleteSavedTokensForUser(userId, tokens);                                                        // 580
      }, accounts._noConnectionCloseDelayForTest ? 0 : CONNECTION_CLOSE_DELAY_MS);                                 // 581
      // We do not set the login token on this connection, but instead the                                         //
      // observe closes the connection and the client will reconnect with the                                      //
      // new token.                                                                                                //
      return {                                                                                                     // 586
        token: newToken.token,                                                                                     // 587
        tokenExpires: accounts._tokenExpiration(newToken.when)                                                     // 588
      };                                                                                                           // 586
    } else {                                                                                                       // 590
      throw new Meteor.Error("You are not logged in.");                                                            // 591
    }                                                                                                              // 592
  };                                                                                                               // 593
                                                                                                                   //
  // Generates a new login token with the same expiration as the                                                   //
  // connection's current token and saves it to the database. Associates                                           //
  // the connection with this new token and returns it. Throws an error                                            //
  // if called on a connection that isn't logged in.                                                               //
  //                                                                                                               //
  // @returns Object                                                                                               //
  //   If successful, returns { token: <new token>, id: <user id>,                                                 //
  //   tokenExpires: <expiration date> }.                                                                          //
  methods.getNewToken = function () {                                                                              // 603
    var self = this;                                                                                               // 604
    var user = accounts.users.findOne(self.userId, {                                                               // 605
      fields: { "services.resume.loginTokens": 1 }                                                                 // 606
    });                                                                                                            // 605
    if (!self.userId || !user) {                                                                                   // 608
      throw new Meteor.Error("You are not logged in.");                                                            // 609
    }                                                                                                              // 610
    // Be careful not to generate a new token that has a later                                                     //
    // expiration than the curren token. Otherwise, a bad guy with a                                               //
    // stolen token could use this method to stop his stolen token from                                            //
    // ever expiring.                                                                                              //
    var currentHashedToken = accounts._getLoginToken(self.connection.id);                                          // 615
    var currentStampedToken = _.find(user.services.resume.loginTokens, function (stampedToken) {                   // 616
      return stampedToken.hashedToken === currentHashedToken;                                                      // 619
    });                                                                                                            // 620
    if (!currentStampedToken) {                                                                                    // 622
      // safety belt: this should never happen                                                                     //
      throw new Meteor.Error("Invalid login token");                                                               // 623
    }                                                                                                              // 624
    var newStampedToken = accounts._generateStampedLoginToken();                                                   // 625
    newStampedToken.when = currentStampedToken.when;                                                               // 626
    accounts._insertLoginToken(self.userId, newStampedToken);                                                      // 627
    return accounts._loginUser(self, self.userId, newStampedToken);                                                // 628
  };                                                                                                               // 629
                                                                                                                   //
  // Removes all tokens except the token associated with the current                                               //
  // connection. Throws an error if the connection is not logged                                                   //
  // in. Returns nothing on success.                                                                               //
  methods.removeOtherTokens = function () {                                                                        // 634
    var self = this;                                                                                               // 635
    if (!self.userId) {                                                                                            // 636
      throw new Meteor.Error("You are not logged in.");                                                            // 637
    }                                                                                                              // 638
    var currentToken = accounts._getLoginToken(self.connection.id);                                                // 639
    accounts.users.update(self.userId, {                                                                           // 640
      $pull: {                                                                                                     // 641
        "services.resume.loginTokens": { hashedToken: { $ne: currentToken } }                                      // 642
      }                                                                                                            // 641
    });                                                                                                            // 640
  };                                                                                                               // 645
                                                                                                                   //
  // Allow a one-time configuration for a login service. Modifications                                             //
  // to this collection are also allowed in insecure mode.                                                         //
  methods.configureLoginService = function (options) {                                                             // 649
    check(options, Match.ObjectIncluding({ service: String }));                                                    // 650
    // Don't let random users configure a service we haven't added yet (so                                         //
    // that when we do later add it, it's set up with their configuration                                          //
    // instead of ours).                                                                                           //
    // XXX if service configuration is oauth-specific then this code should                                        //
    //     be in accounts-oauth; if it's not then the registry should be                                           //
    //     in this package                                                                                         //
    if (!(accounts.oauth && _.contains(accounts.oauth.serviceNames(), options.service))) {                         // 657
      throw new Meteor.Error(403, "Service unknown");                                                              // 659
    }                                                                                                              // 660
                                                                                                                   //
    var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                              // 662
    if (ServiceConfiguration.configurations.findOne({ service: options.service })) throw new Meteor.Error(403, "Service " + options.service + " already configured");
                                                                                                                   //
    if (_.has(options, "secret") && usingOAuthEncryption()) options.secret = OAuthEncryption.seal(options.secret);
                                                                                                                   //
    ServiceConfiguration.configurations.insert(options);                                                           // 670
  };                                                                                                               // 671
                                                                                                                   //
  accounts._server.methods(methods);                                                                               // 673
};                                                                                                                 // 674
                                                                                                                   //
Ap._initAccountDataHooks = function () {                                                                           // 676
  var accounts = this;                                                                                             // 677
                                                                                                                   //
  accounts._server.onConnection(function (connection) {                                                            // 679
    accounts._accountData[connection.id] = {                                                                       // 680
      connection: connection                                                                                       // 681
    };                                                                                                             // 680
                                                                                                                   //
    connection.onClose(function () {                                                                               // 684
      accounts._removeTokenFromConnection(connection.id);                                                          // 685
      delete accounts._accountData[connection.id];                                                                 // 686
    });                                                                                                            // 687
  });                                                                                                              // 688
};                                                                                                                 // 689
                                                                                                                   //
Ap._initServerPublications = function () {                                                                         // 691
  var accounts = this;                                                                                             // 692
                                                                                                                   //
  // Publish all login service configuration fields other than secret.                                             //
  accounts._server.publish("meteor.loginServiceConfiguration", function () {                                       // 695
    var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                              // 696
    return ServiceConfiguration.configurations.find({}, { fields: { secret: 0 } });                                // 698
  }, { is_auto: true }); // not techincally autopublish, but stops the warning.                                    // 699
                                                                                                                   //
  // Publish the current user's record to the client.                                                              //
  accounts._server.publish(null, function () {                                                                     // 702
    if (this.userId) {                                                                                             // 703
      return accounts.users.find({                                                                                 // 704
        _id: this.userId                                                                                           // 705
      }, {                                                                                                         // 704
        fields: {                                                                                                  // 707
          profile: 1,                                                                                              // 708
          username: 1,                                                                                             // 709
          emails: 1                                                                                                // 710
        }                                                                                                          // 707
      });                                                                                                          // 706
    } else {                                                                                                       // 713
      return null;                                                                                                 // 714
    }                                                                                                              // 715
  }, /*suppress autopublish warning*/{ is_auto: true });                                                           // 716
                                                                                                                   //
  // Use Meteor.startup to give other packages a chance to call                                                    //
  // addAutopublishFields.                                                                                         //
  Package.autopublish && Meteor.startup(function () {                                                              // 720
    // ['profile', 'username'] -> {profile: 1, username: 1}                                                        //
    var toFieldSelector = function toFieldSelector(fields) {                                                       // 722
      return _.object(_.map(fields, function (field) {                                                             // 723
        return [field, 1];                                                                                         // 724
      }));                                                                                                         // 725
    };                                                                                                             // 726
                                                                                                                   //
    accounts._server.publish(null, function () {                                                                   // 728
      if (this.userId) {                                                                                           // 729
        return accounts.users.find({                                                                               // 730
          _id: this.userId                                                                                         // 731
        }, {                                                                                                       // 730
          fields: toFieldSelector(accounts._autopublishFields.loggedInUser)                                        // 733
        });                                                                                                        // 732
      } else {                                                                                                     // 735
        return null;                                                                                               // 736
      }                                                                                                            // 737
    }, /*suppress autopublish warning*/{ is_auto: true });                                                         // 738
                                                                                                                   //
    // XXX this publish is neither dedup-able nor is it optimized by our special                                   //
    // treatment of queries on a specific _id. Therefore this will have O(n^2)                                     //
    // run-time performance every time a user document is changed (eg someone                                      //
    // logging in). If this is a problem, we can instead write a manual publish                                    //
    // function which filters out fields based on 'this.userId'.                                                   //
    accounts._server.publish(null, function () {                                                                   // 745
      var selector = this.userId ? {                                                                               // 746
        _id: { $ne: this.userId }                                                                                  // 747
      } : {};                                                                                                      // 746
                                                                                                                   //
      return accounts.users.find(selector, {                                                                       // 750
        fields: toFieldSelector(accounts._autopublishFields.otherUsers)                                            // 751
      });                                                                                                          // 750
    }, /*suppress autopublish warning*/{ is_auto: true });                                                         // 753
  });                                                                                                              // 754
};                                                                                                                 // 755
                                                                                                                   //
// Add to the list of fields or subfields to be automatically                                                      //
// published if autopublish is on. Must be called from top-level                                                   //
// code (ie, before Meteor.startup hooks run).                                                                     //
//                                                                                                                 //
// @param opts {Object} with:                                                                                      //
//   - forLoggedInUser {Array} Array of fields published to the logged-in user                                     //
//   - forOtherUsers {Array} Array of fields published to users that aren't logged in                              //
Ap.addAutopublishFields = function (opts) {                                                                        // 764
  this._autopublishFields.loggedInUser.push.apply(this._autopublishFields.loggedInUser, opts.forLoggedInUser);     // 765
  this._autopublishFields.otherUsers.push.apply(this._autopublishFields.otherUsers, opts.forOtherUsers);           // 767
};                                                                                                                 // 769
                                                                                                                   //
///                                                                                                                //
/// ACCOUNT DATA                                                                                                   //
///                                                                                                                //
                                                                                                                   //
// HACK: This is used by 'meteor-accounts' to get the loginToken for a                                             //
// connection. Maybe there should be a public way to do that.                                                      //
Ap._getAccountData = function (connectionId, field) {                                                              // 777
  var data = this._accountData[connectionId];                                                                      // 778
  return data && data[field];                                                                                      // 779
};                                                                                                                 // 780
                                                                                                                   //
Ap._setAccountData = function (connectionId, field, value) {                                                       // 782
  var data = this._accountData[connectionId];                                                                      // 783
                                                                                                                   //
  // safety belt. shouldn't happen. accountData is set in onConnection,                                            //
  // we don't have a connectionId until it is set.                                                                 //
  if (!data) return;                                                                                               // 787
                                                                                                                   //
  if (value === undefined) delete data[field];else data[field] = value;                                            // 790
};                                                                                                                 // 794
                                                                                                                   //
///                                                                                                                //
/// RECONNECT TOKENS                                                                                               //
///                                                                                                                //
/// support reconnecting using a meteor login token                                                                //
                                                                                                                   //
Ap._hashLoginToken = function (loginToken) {                                                                       // 802
  var hash = crypto.createHash('sha256');                                                                          // 803
  hash.update(loginToken);                                                                                         // 804
  return hash.digest('base64');                                                                                    // 805
};                                                                                                                 // 806
                                                                                                                   //
// {token, when} => {hashedToken, when}                                                                            //
Ap._hashStampedToken = function (stampedToken) {                                                                   // 810
  return _.extend(_.omit(stampedToken, 'token'), {                                                                 // 811
    hashedToken: this._hashLoginToken(stampedToken.token)                                                          // 812
  });                                                                                                              // 811
};                                                                                                                 // 814
                                                                                                                   //
// Using $addToSet avoids getting an index error if another client                                                 //
// logging in simultaneously has already inserted the new hashed                                                   //
// token.                                                                                                          //
Ap._insertHashedLoginToken = function (userId, hashedToken, query) {                                               // 820
  query = query ? _.clone(query) : {};                                                                             // 821
  query._id = userId;                                                                                              // 822
  this.users.update(query, {                                                                                       // 823
    $addToSet: {                                                                                                   // 824
      "services.resume.loginTokens": hashedToken                                                                   // 825
    }                                                                                                              // 824
  });                                                                                                              // 823
};                                                                                                                 // 828
                                                                                                                   //
// Exported for tests.                                                                                             //
Ap._insertLoginToken = function (userId, stampedToken, query) {                                                    // 832
  this._insertHashedLoginToken(userId, this._hashStampedToken(stampedToken), query);                               // 833
};                                                                                                                 // 838
                                                                                                                   //
Ap._clearAllLoginTokens = function (userId) {                                                                      // 841
  this.users.update(userId, {                                                                                      // 842
    $set: {                                                                                                        // 843
      'services.resume.loginTokens': []                                                                            // 844
    }                                                                                                              // 843
  });                                                                                                              // 842
};                                                                                                                 // 847
                                                                                                                   //
// test hook                                                                                                       //
Ap._getUserObserve = function (connectionId) {                                                                     // 850
  return this._userObservesForConnections[connectionId];                                                           // 851
};                                                                                                                 // 852
                                                                                                                   //
// Clean up this connection's association with the token: that is, stop                                            //
// the observe that we started when we associated the connection with                                              //
// this token.                                                                                                     //
Ap._removeTokenFromConnection = function (connectionId) {                                                          // 857
  if (_.has(this._userObservesForConnections, connectionId)) {                                                     // 858
    var observe = this._userObservesForConnections[connectionId];                                                  // 859
    if (typeof observe === 'number') {                                                                             // 860
      // We're in the process of setting up an observe for this connection. We                                     //
      // can't clean up that observe yet, but if we delete the placeholder for                                     //
      // this connection, then the observe will get cleaned up as soon as it has                                   //
      // been set up.                                                                                              //
      delete this._userObservesForConnections[connectionId];                                                       // 865
    } else {                                                                                                       // 866
      delete this._userObservesForConnections[connectionId];                                                       // 867
      observe.stop();                                                                                              // 868
    }                                                                                                              // 869
  }                                                                                                                // 870
};                                                                                                                 // 871
                                                                                                                   //
Ap._getLoginToken = function (connectionId) {                                                                      // 873
  return this._getAccountData(connectionId, 'loginToken');                                                         // 874
};                                                                                                                 // 875
                                                                                                                   //
// newToken is a hashed token.                                                                                     //
Ap._setLoginToken = function (userId, connection, newToken) {                                                      // 878
  var self = this;                                                                                                 // 879
                                                                                                                   //
  self._removeTokenFromConnection(connection.id);                                                                  // 881
  self._setAccountData(connection.id, 'loginToken', newToken);                                                     // 882
                                                                                                                   //
  if (newToken) {                                                                                                  // 884
    // Set up an observe for this token. If the token goes away, we need                                           //
    // to close the connection.  We defer the observe because there's                                              //
    // no need for it to be on the critical path for login; we just need                                           //
    // to ensure that the connection will get closed at some point if                                              //
    // the token gets deleted.                                                                                     //
    //                                                                                                             //
    // Initially, we set the observe for this connection to a number; this                                         //
    // signifies to other code (which might run while we yield) that we are in                                     //
    // the process of setting up an observe for this connection. Once the                                          //
    // observe is ready to go, we replace the number with the real observe                                         //
    // handle (unless the placeholder has been deleted or replaced by a                                            //
    // different placehold number, signifying that the connection was closed                                       //
    // already -- in this case we just clean up the observe that we started).                                      //
    var myObserveNumber = ++self._nextUserObserveNumber;                                                           // 898
    self._userObservesForConnections[connection.id] = myObserveNumber;                                             // 899
    Meteor.defer(function () {                                                                                     // 900
      // If something else happened on this connection in the meantime (it got                                     //
      // closed, or another call to _setLoginToken happened), just do                                              //
      // nothing. We don't need to start an observe for an old connection or old                                   //
      // token.                                                                                                    //
      if (self._userObservesForConnections[connection.id] !== myObserveNumber) {                                   // 905
        return;                                                                                                    // 906
      }                                                                                                            // 907
                                                                                                                   //
      var foundMatchingUser;                                                                                       // 909
      // Because we upgrade unhashed login tokens to hashed tokens at                                              //
      // login time, sessions will only be logged in with a hashed                                                 //
      // token. Thus we only need to observe hashed tokens here.                                                   //
      var observe = self.users.find({                                                                              // 913
        _id: userId,                                                                                               // 914
        'services.resume.loginTokens.hashedToken': newToken                                                        // 915
      }, { fields: { _id: 1 } }).observeChanges({                                                                  // 913
        added: function added() {                                                                                  // 917
          foundMatchingUser = true;                                                                                // 918
        },                                                                                                         // 919
        removed: function removed() {                                                                              // 920
          connection.close();                                                                                      // 921
          // The onClose callback for the connection takes care of                                                 //
          // cleaning up the observe handle and any other state we have                                            //
          // lying around.                                                                                         //
        }                                                                                                          // 925
      });                                                                                                          // 916
                                                                                                                   //
      // If the user ran another login or logout command we were waiting for the                                   //
      // defer or added to fire (ie, another call to _setLoginToken occurred),                                     //
      // then we let the later one win (start an observe, etc) and just stop our                                   //
      // observe now.                                                                                              //
      //                                                                                                           //
      // Similarly, if the connection was already closed, then the onClose                                         //
      // callback would have called _removeTokenFromConnection and there won't                                     //
      // be an entry in _userObservesForConnections. We can stop the observe.                                      //
      if (self._userObservesForConnections[connection.id] !== myObserveNumber) {                                   // 936
        observe.stop();                                                                                            // 937
        return;                                                                                                    // 938
      }                                                                                                            // 939
                                                                                                                   //
      self._userObservesForConnections[connection.id] = observe;                                                   // 941
                                                                                                                   //
      if (!foundMatchingUser) {                                                                                    // 943
        // We've set up an observe on the user associated with `newToken`,                                         //
        // so if the new token is removed from the database, we'll close                                           //
        // the connection. But the token might have already been deleted                                           //
        // before we set up the observe, which wouldn't have closed the                                            //
        // connection because the observe wasn't running yet.                                                      //
        connection.close();                                                                                        // 949
      }                                                                                                            // 950
    });                                                                                                            // 951
  }                                                                                                                // 952
};                                                                                                                 // 953
                                                                                                                   //
function setupDefaultLoginHandlers(accounts) {                                                                     // 955
  accounts.registerLoginHandler("resume", function (options) {                                                     // 956
    return defaultResumeLoginHandler.call(this, accounts, options);                                                // 957
  });                                                                                                              // 958
}                                                                                                                  // 959
                                                                                                                   //
// Login handler for resume tokens.                                                                                //
function defaultResumeLoginHandler(accounts, options) {                                                            // 962
  if (!options.resume) return undefined;                                                                           // 963
                                                                                                                   //
  check(options.resume, String);                                                                                   // 966
                                                                                                                   //
  var hashedToken = accounts._hashLoginToken(options.resume);                                                      // 968
                                                                                                                   //
  // First look for just the new-style hashed login token, to avoid                                                //
  // sending the unhashed token to the database in a query if we don't                                             //
  // need to.                                                                                                      //
  var user = accounts.users.findOne({ "services.resume.loginTokens.hashedToken": hashedToken });                   // 973
                                                                                                                   //
  if (!user) {                                                                                                     // 976
    // If we didn't find the hashed login token, try also looking for                                              //
    // the old-style unhashed token.  But we need to look for either                                               //
    // the old-style token OR the new-style token, because another                                                 //
    // client connection logging in simultaneously might have already                                              //
    // converted the token.                                                                                        //
    user = accounts.users.findOne({                                                                                // 982
      $or: [{ "services.resume.loginTokens.hashedToken": hashedToken }, { "services.resume.loginTokens.token": options.resume }]
    });                                                                                                            // 982
  }                                                                                                                // 988
                                                                                                                   //
  if (!user) return {                                                                                              // 990
    error: new Meteor.Error(403, "You've been logged out by the server. Please log in again.")                     // 992
  };                                                                                                               // 991
                                                                                                                   //
  // Find the token, which will either be an object with fields                                                    //
  // {hashedToken, when} for a hashed token or {token, when} for an                                                //
  // unhashed token.                                                                                               //
  var oldUnhashedStyleToken;                                                                                       // 998
  var token = _.find(user.services.resume.loginTokens, function (token) {                                          // 999
    return token.hashedToken === hashedToken;                                                                      // 1000
  });                                                                                                              // 1001
  if (token) {                                                                                                     // 1002
    oldUnhashedStyleToken = false;                                                                                 // 1003
  } else {                                                                                                         // 1004
    token = _.find(user.services.resume.loginTokens, function (token) {                                            // 1005
      return token.token === options.resume;                                                                       // 1006
    });                                                                                                            // 1007
    oldUnhashedStyleToken = true;                                                                                  // 1008
  }                                                                                                                // 1009
                                                                                                                   //
  var tokenExpires = accounts._tokenExpiration(token.when);                                                        // 1011
  if (new Date() >= tokenExpires) return {                                                                         // 1012
    userId: user._id,                                                                                              // 1014
    error: new Meteor.Error(403, "Your session has expired. Please log in again.")                                 // 1015
  };                                                                                                               // 1013
                                                                                                                   //
  // Update to a hashed token when an unhashed token is encountered.                                               //
  if (oldUnhashedStyleToken) {                                                                                     // 1019
    // Only add the new hashed token if the old unhashed token still                                               //
    // exists (this avoids resurrecting the token if it was deleted                                                //
    // after we read it).  Using $addToSet avoids getting an index                                                 //
    // error if another client logging in simultaneously has already                                               //
    // inserted the new hashed token.                                                                              //
    accounts.users.update({                                                                                        // 1025
      _id: user._id,                                                                                               // 1027
      "services.resume.loginTokens.token": options.resume                                                          // 1028
    }, { $addToSet: {                                                                                              // 1026
        "services.resume.loginTokens": {                                                                           // 1031
          "hashedToken": hashedToken,                                                                              // 1032
          "when": token.when                                                                                       // 1033
        }                                                                                                          // 1031
      } });                                                                                                        // 1030
                                                                                                                   //
    // Remove the old token *after* adding the new, since otherwise                                                //
    // another client trying to login between our removing the old and                                             //
    // adding the new wouldn't find a token to login with.                                                         //
    accounts.users.update(user._id, {                                                                              // 1041
      $pull: {                                                                                                     // 1042
        "services.resume.loginTokens": { "token": options.resume }                                                 // 1043
      }                                                                                                            // 1042
    });                                                                                                            // 1041
  }                                                                                                                // 1046
                                                                                                                   //
  return {                                                                                                         // 1048
    userId: user._id,                                                                                              // 1049
    stampedLoginToken: {                                                                                           // 1050
      token: options.resume,                                                                                       // 1051
      when: token.when                                                                                             // 1052
    }                                                                                                              // 1050
  };                                                                                                               // 1048
}                                                                                                                  // 1055
                                                                                                                   //
// (Also used by Meteor Accounts server and tests).                                                                //
//                                                                                                                 //
Ap._generateStampedLoginToken = function () {                                                                      // 1059
  return {                                                                                                         // 1060
    token: Random.secret(),                                                                                        // 1061
    when: new Date()                                                                                               // 1062
  };                                                                                                               // 1060
};                                                                                                                 // 1064
                                                                                                                   //
///                                                                                                                //
/// TOKEN EXPIRATION                                                                                               //
///                                                                                                                //
                                                                                                                   //
// Deletes expired tokens from the database and closes all open connections                                        //
// associated with these tokens.                                                                                   //
//                                                                                                                 //
// Exported for tests. Also, the arguments are only used by                                                        //
// tests. oldestValidDate is simulate expiring tokens without waiting                                              //
// for them to actually expire. userId is used by tests to only expire                                             //
// tokens for the test user.                                                                                       //
Ap._expireTokens = function (oldestValidDate, userId) {                                                            // 1077
  var tokenLifetimeMs = this._getTokenLifetimeMs();                                                                // 1078
                                                                                                                   //
  // when calling from a test with extra arguments, you must specify both!                                         //
  if (oldestValidDate && !userId || !oldestValidDate && userId) {                                                  // 1081
    throw new Error("Bad test. Must specify both oldestValidDate and userId.");                                    // 1082
  }                                                                                                                // 1083
                                                                                                                   //
  oldestValidDate = oldestValidDate || new Date(new Date() - tokenLifetimeMs);                                     // 1085
  var userFilter = userId ? { _id: userId } : {};                                                                  // 1087
                                                                                                                   //
  // Backwards compatible with older versions of meteor that stored login token                                    //
  // timestamps as numbers.                                                                                        //
  this.users.update(_.extend(userFilter, {                                                                         // 1092
    $or: [{ "services.resume.loginTokens.when": { $lt: oldestValidDate } }, { "services.resume.loginTokens.when": { $lt: +oldestValidDate } }]
  }), {                                                                                                            // 1092
    $pull: {                                                                                                       // 1098
      "services.resume.loginTokens": {                                                                             // 1099
        $or: [{ when: { $lt: oldestValidDate } }, { when: { $lt: +oldestValidDate } }]                             // 1100
      }                                                                                                            // 1099
    }                                                                                                              // 1098
  }, { multi: true });                                                                                             // 1097
  // The observe on Meteor.users will take care of closing connections for                                         //
  // expired tokens.                                                                                               //
};                                                                                                                 // 1109
                                                                                                                   //
// @override from accounts_common.js                                                                               //
Ap.config = function (options) {                                                                                   // 1112
  // Call the overridden implementation of the method.                                                             //
  var superResult = AccountsCommon.prototype.config.apply(this, arguments);                                        // 1114
                                                                                                                   //
  // If the user set loginExpirationInDays to null, then we need to clear the                                      //
  // timer that periodically expires tokens.                                                                       //
  if (_.has(this._options, "loginExpirationInDays") && this._options.loginExpirationInDays === null && this.expireTokenInterval) {
    Meteor.clearInterval(this.expireTokenInterval);                                                                // 1121
    this.expireTokenInterval = null;                                                                               // 1122
  }                                                                                                                // 1123
                                                                                                                   //
  return superResult;                                                                                              // 1125
};                                                                                                                 // 1126
                                                                                                                   //
function setExpireTokensInterval(accounts) {                                                                       // 1128
  accounts.expireTokenInterval = Meteor.setInterval(function () {                                                  // 1129
    accounts._expireTokens();                                                                                      // 1130
  }, EXPIRE_TOKENS_INTERVAL_MS);                                                                                   // 1131
}                                                                                                                  // 1132
                                                                                                                   //
///                                                                                                                //
/// OAuth Encryption Support                                                                                       //
///                                                                                                                //
                                                                                                                   //
var OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption;                  // 1139
                                                                                                                   //
function usingOAuthEncryption() {                                                                                  // 1143
  return OAuthEncryption && OAuthEncryption.keyIsLoaded();                                                         // 1144
}                                                                                                                  // 1145
                                                                                                                   //
// OAuth service data is temporarily stored in the pending credentials                                             //
// collection during the oauth authentication process.  Sensitive data                                             //
// such as access tokens are encrypted without the user id because                                                 //
// we don't know the user id yet.  We re-encrypt these fields with the                                             //
// user id included when storing the service data permanently in                                                   //
// the users collection.                                                                                           //
//                                                                                                                 //
function pinEncryptedFieldsToUser(serviceData, userId) {                                                           // 1155
  _.each(_.keys(serviceData), function (key) {                                                                     // 1156
    var value = serviceData[key];                                                                                  // 1157
    if (OAuthEncryption && OAuthEncryption.isSealed(value)) value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
    serviceData[key] = value;                                                                                      // 1160
  });                                                                                                              // 1161
}                                                                                                                  // 1162
                                                                                                                   //
// Encrypt unencrypted login service secrets when oauth-encryption is                                              //
// added.                                                                                                          //
//                                                                                                                 //
// XXX For the oauthSecretKey to be available here at startup, the                                                 //
// developer must call Accounts.config({oauthSecretKey: ...}) at load                                              //
// time, instead of in a Meteor.startup block, because the startup                                                 //
// block in the app code will run after this accounts-base startup                                                 //
// block.  Perhaps we need a post-startup callback?                                                                //
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1174
  if (!usingOAuthEncryption()) {                                                                                   // 1175
    return;                                                                                                        // 1176
  }                                                                                                                // 1177
                                                                                                                   //
  var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;                                // 1179
                                                                                                                   //
  ServiceConfiguration.configurations.find({                                                                       // 1182
    $and: [{                                                                                                       // 1183
      secret: { $exists: true }                                                                                    // 1184
    }, {                                                                                                           // 1183
      "secret.algorithm": { $exists: false }                                                                       // 1186
    }]                                                                                                             // 1185
  }).forEach(function (config) {                                                                                   // 1182
    ServiceConfiguration.configurations.update(config._id, {                                                       // 1189
      $set: {                                                                                                      // 1190
        secret: OAuthEncryption.seal(config.secret)                                                                // 1191
      }                                                                                                            // 1190
    });                                                                                                            // 1189
  });                                                                                                              // 1194
});                                                                                                                // 1195
                                                                                                                   //
// XXX see comment on Accounts.createUser in passwords_server about adding a                                       //
// second "server options" argument.                                                                               //
function defaultCreateUserHook(options, user) {                                                                    // 1199
  if (options.profile) user.profile = options.profile;                                                             // 1200
  return user;                                                                                                     // 1202
}                                                                                                                  // 1203
                                                                                                                   //
// Called by accounts-password                                                                                     //
Ap.insertUserDoc = function (options, user) {                                                                      // 1206
  // - clone user document, to protect from modification                                                           //
  // - add createdAt timestamp                                                                                     //
  // - prepare an _id, so that you can modify other collections (eg                                                //
  // create a first task for every new user)                                                                       //
  //                                                                                                               //
  // XXX If the onCreateUser or validateNewUser hooks fail, we might                                               //
  // end up having modified some other collection                                                                  //
  // inappropriately. The solution is probably to have onCreateUser                                                //
  // accept two callbacks - one that gets called before inserting                                                  //
  // the user document (in which you can modify its contents), and                                                 //
  // one that gets called after (in which you should change other                                                  //
  // collections)                                                                                                  //
  user = _.extend({                                                                                                // 1219
    createdAt: new Date(),                                                                                         // 1220
    _id: Random.id()                                                                                               // 1221
  }, user);                                                                                                        // 1219
                                                                                                                   //
  if (user.services) {                                                                                             // 1224
    _.each(user.services, function (serviceData) {                                                                 // 1225
      pinEncryptedFieldsToUser(serviceData, user._id);                                                             // 1226
    });                                                                                                            // 1227
  }                                                                                                                // 1228
                                                                                                                   //
  var fullUser;                                                                                                    // 1230
  if (this._onCreateUserHook) {                                                                                    // 1231
    fullUser = this._onCreateUserHook(options, user);                                                              // 1232
                                                                                                                   //
    // This is *not* part of the API. We need this because we can't isolate                                        //
    // the global server environment between tests, meaning we can't test                                          //
    // both having a create user hook set and not having one set.                                                  //
    if (fullUser === 'TEST DEFAULT HOOK') fullUser = defaultCreateUserHook(options, user);                         // 1237
  } else {                                                                                                         // 1239
    fullUser = defaultCreateUserHook(options, user);                                                               // 1240
  }                                                                                                                // 1241
                                                                                                                   //
  _.each(this._validateNewUserHooks, function (hook) {                                                             // 1243
    if (!hook(fullUser)) throw new Meteor.Error(403, "User validation failed");                                    // 1244
  });                                                                                                              // 1246
                                                                                                                   //
  var userId;                                                                                                      // 1248
  try {                                                                                                            // 1249
    userId = this.users.insert(fullUser);                                                                          // 1250
  } catch (e) {                                                                                                    // 1251
    // XXX string parsing sucks, maybe                                                                             //
    // https://jira.mongodb.org/browse/SERVER-3069 will get fixed one day                                          //
    if (e.name !== 'MongoError') throw e;                                                                          // 1254
    if (e.code !== 11000) throw e;                                                                                 // 1255
    if (e.err.indexOf('emails.address') !== -1) throw new Meteor.Error(403, "Email already exists.");              // 1256
    if (e.err.indexOf('username') !== -1) throw new Meteor.Error(403, "Username already exists.");                 // 1258
    // XXX better error reporting for services.facebook.id duplicate, etc                                          //
    throw e;                                                                                                       // 1261
  }                                                                                                                // 1262
  return userId;                                                                                                   // 1263
};                                                                                                                 // 1264
                                                                                                                   //
// Helper function: returns false if email does not match company domain from                                      //
// the configuration.                                                                                              //
Ap._testEmailDomain = function (email) {                                                                           // 1268
  var domain = this._options.restrictCreationByEmailDomain;                                                        // 1269
  return !domain || _.isFunction(domain) && domain(email) || _.isString(domain) && new RegExp('@' + Meteor._escapeRegExp(domain) + '$', 'i').test(email);
};                                                                                                                 // 1274
                                                                                                                   //
// Validate new user's email or Google/Facebook/GitHub account's email                                             //
function defaultValidateNewUserHook(user) {                                                                        // 1277
  var self = this;                                                                                                 // 1278
  var domain = self._options.restrictCreationByEmailDomain;                                                        // 1279
  if (!domain) return true;                                                                                        // 1280
                                                                                                                   //
  var emailIsGood = false;                                                                                         // 1283
  if (!_.isEmpty(user.emails)) {                                                                                   // 1284
    emailIsGood = _.any(user.emails, function (email) {                                                            // 1285
      return self._testEmailDomain(email.address);                                                                 // 1286
    });                                                                                                            // 1287
  } else if (!_.isEmpty(user.services)) {                                                                          // 1288
    // Find any email of any service and check it                                                                  //
    emailIsGood = _.any(user.services, function (service) {                                                        // 1290
      return service.email && self._testEmailDomain(service.email);                                                // 1291
    });                                                                                                            // 1292
  }                                                                                                                // 1293
                                                                                                                   //
  if (emailIsGood) return true;                                                                                    // 1295
                                                                                                                   //
  if (_.isString(domain)) throw new Meteor.Error(403, "@" + domain + " email required");else throw new Meteor.Error(403, "Email doesn't match the criteria.");
}                                                                                                                  // 1302
                                                                                                                   //
///                                                                                                                //
/// MANAGING USER OBJECTS                                                                                          //
///                                                                                                                //
                                                                                                                   //
// Updates or creates a user after we authenticate with a 3rd party.                                               //
//                                                                                                                 //
// @param serviceName {String} Service name (eg, twitter).                                                         //
// @param serviceData {Object} Data to store in the user's record                                                  //
//        under services[serviceName]. Must include an "id" field                                                  //
//        which is a unique identifier for the user in the service.                                                //
// @param options {Object, optional} Other options to pass to insertUserDoc                                        //
//        (eg, profile)                                                                                            //
// @returns {Object} Object with token and id keys, like the result                                                //
//        of the "login" method.                                                                                   //
//                                                                                                                 //
Ap.updateOrCreateUserFromExternalService = function (serviceName, serviceData, options) {                          // 1319
  options = _.clone(options || {});                                                                                // 1324
                                                                                                                   //
  if (serviceName === "password" || serviceName === "resume") throw new Error("Can't use updateOrCreateUserFromExternalService with internal service " + serviceName);
  if (!_.has(serviceData, 'id')) throw new Error("Service data for service " + serviceName + " must include id");  // 1330
                                                                                                                   //
  // Look for a user with the appropriate service user id.                                                         //
  var selector = {};                                                                                               // 1335
  var serviceIdKey = "services." + serviceName + ".id";                                                            // 1336
                                                                                                                   //
  // XXX Temporary special case for Twitter. (Issue #629)                                                          //
  //   The serviceData.id will be a string representation of an integer.                                           //
  //   We want it to match either a stored string or int representation.                                           //
  //   This is to cater to earlier versions of Meteor storing twitter                                              //
  //   user IDs in number form, and recent versions storing them as strings.                                       //
  //   This can be removed once migration technology is in place, and twitter                                      //
  //   users stored with integer IDs have been migrated to string IDs.                                             //
  if (serviceName === "twitter" && !isNaN(serviceData.id)) {                                                       // 1345
    selector["$or"] = [{}, {}];                                                                                    // 1346
    selector["$or"][0][serviceIdKey] = serviceData.id;                                                             // 1347
    selector["$or"][1][serviceIdKey] = parseInt(serviceData.id, 10);                                               // 1348
  } else {                                                                                                         // 1349
    selector[serviceIdKey] = serviceData.id;                                                                       // 1350
  }                                                                                                                // 1351
                                                                                                                   //
  var user = this.users.findOne(selector);                                                                         // 1353
                                                                                                                   //
  if (user) {                                                                                                      // 1355
    pinEncryptedFieldsToUser(serviceData, user._id);                                                               // 1356
                                                                                                                   //
    // We *don't* process options (eg, profile) for update, but we do replace                                      //
    // the serviceData (eg, so that we keep an unexpired access token and                                          //
    // don't cache old email addresses in serviceData.email).                                                      //
    // XXX provide an onUpdateUser hook which would let apps update                                                //
    //     the profile too                                                                                         //
    var setAttrs = {};                                                                                             // 1363
    _.each(serviceData, function (value, key) {                                                                    // 1364
      setAttrs["services." + serviceName + "." + key] = value;                                                     // 1365
    });                                                                                                            // 1366
                                                                                                                   //
    // XXX Maybe we should re-use the selector above and notice if the update                                      //
    //     touches nothing?                                                                                        //
    this.users.update(user._id, {                                                                                  // 1370
      $set: setAttrs                                                                                               // 1371
    });                                                                                                            // 1370
                                                                                                                   //
    return {                                                                                                       // 1374
      type: serviceName,                                                                                           // 1375
      userId: user._id                                                                                             // 1376
    };                                                                                                             // 1374
  } else {                                                                                                         // 1379
    // Create a new user with the service data. Pass other options through to                                      //
    // insertUserDoc.                                                                                              //
    user = { services: {} };                                                                                       // 1382
    user.services[serviceName] = serviceData;                                                                      // 1383
    return {                                                                                                       // 1384
      type: serviceName,                                                                                           // 1385
      userId: this.insertUserDoc(options, user)                                                                    // 1386
    };                                                                                                             // 1384
  }                                                                                                                // 1388
};                                                                                                                 // 1389
                                                                                                                   //
function setupUsersCollection(users) {                                                                             // 1391
  ///                                                                                                              //
  /// RESTRICTING WRITES TO USER OBJECTS                                                                           //
  ///                                                                                                              //
  users.allow({                                                                                                    // 1395
    // clients can modify the profile field of their own document, and                                             //
    // nothing else.                                                                                               //
    update: function update(userId, user, fields, modifier) {                                                      // 1398
      // make sure it is our record                                                                                //
      if (user._id !== userId) return false;                                                                       // 1400
                                                                                                                   //
      // user can only modify the 'profile' field. sets to multiple                                                //
      // sub-keys (eg profile.foo and profile.bar) are merged into entry                                           //
      // in the fields list.                                                                                       //
      if (fields.length !== 1 || fields[0] !== 'profile') return false;                                            // 1406
                                                                                                                   //
      return true;                                                                                                 // 1409
    },                                                                                                             // 1410
    fetch: ['_id'] // we only look at _id.                                                                         // 1411
  });                                                                                                              // 1395
                                                                                                                   //
  /// DEFAULT INDEXES ON USERS                                                                                     //
  users._ensureIndex('username', { unique: 1, sparse: 1 });                                                        // 1415
  users._ensureIndex('emails.address', { unique: 1, sparse: 1 });                                                  // 1416
  users._ensureIndex('services.resume.loginTokens.hashedToken', { unique: 1, sparse: 1 });                         // 1417
  users._ensureIndex('services.resume.loginTokens.token', { unique: 1, sparse: 1 });                               // 1419
  // For taking care of logoutOtherClients calls that crashed before the                                           //
  // tokens were deleted.                                                                                          //
  users._ensureIndex('services.resume.haveLoginTokensToDelete', { sparse: 1 });                                    // 1423
  // For expiring login tokens                                                                                     //
  users._ensureIndex("services.resume.loginTokens.when", { sparse: 1 });                                           // 1426
}                                                                                                                  // 1427
                                                                                                                   //
///                                                                                                                //
/// CLEAN UP FOR `logoutOtherClients`                                                                              //
///                                                                                                                //
                                                                                                                   //
Ap._deleteSavedTokensForUser = function (userId, tokensToDelete) {                                                 // 1433
  if (tokensToDelete) {                                                                                            // 1434
    this.users.update(userId, {                                                                                    // 1435
      $unset: {                                                                                                    // 1436
        "services.resume.haveLoginTokensToDelete": 1,                                                              // 1437
        "services.resume.loginTokensToDelete": 1                                                                   // 1438
      },                                                                                                           // 1436
      $pullAll: {                                                                                                  // 1440
        "services.resume.loginTokens": tokensToDelete                                                              // 1441
      }                                                                                                            // 1440
    });                                                                                                            // 1435
  }                                                                                                                // 1444
};                                                                                                                 // 1445
                                                                                                                   //
Ap._deleteSavedTokensForAllUsersOnStartup = function () {                                                          // 1447
  var self = this;                                                                                                 // 1448
                                                                                                                   //
  // If we find users who have saved tokens to delete on startup, delete                                           //
  // them now. It's possible that the server could have crashed and come                                           //
  // back up before new tokens are found in localStorage, but this                                                 //
  // shouldn't happen very often. We shouldn't put a delay here because                                            //
  // that would give a lot of power to an attacker with a stolen login                                             //
  // token and the ability to crash the server.                                                                    //
  Meteor.startup(function () {                                                                                     // 1456
    self.users.find({                                                                                              // 1457
      "services.resume.haveLoginTokensToDelete": true                                                              // 1458
    }, {                                                                                                           // 1457
      "services.resume.loginTokensToDelete": 1                                                                     // 1460
    }).forEach(function (user) {                                                                                   // 1459
      self._deleteSavedTokensForUser(user._id, user.services.resume.loginTokensToDelete);                          // 1462
    });                                                                                                            // 1466
  });                                                                                                              // 1467
};                                                                                                                 // 1468
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"url_server.js":["./accounts_server.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-base/url_server.js                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var AccountsServer;module.import("./accounts_server.js",{"AccountsServer":function(v){AccountsServer=v}});         // 1
                                                                                                                   //
// XXX These should probably not actually be public?                                                               //
                                                                                                                   //
AccountsServer.prototype.urls = {                                                                                  // 5
  resetPassword: function resetPassword(token) {                                                                   // 6
    return Meteor.absoluteUrl('#/reset-password/' + token);                                                        // 7
  },                                                                                                               // 8
                                                                                                                   //
  verifyEmail: function verifyEmail(token) {                                                                       // 10
    return Meteor.absoluteUrl('#/verify-email/' + token);                                                          // 11
  },                                                                                                               // 12
                                                                                                                   //
  enrollAccount: function enrollAccount(token) {                                                                   // 14
    return Meteor.absoluteUrl('#/enroll-account/' + token);                                                        // 15
  }                                                                                                                // 16
};                                                                                                                 // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/accounts-base/server_main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['accounts-base'] = exports, {
  Accounts: Accounts
});

})();

//# sourceMappingURL=accounts-base.js.map
