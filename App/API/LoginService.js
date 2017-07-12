
var Config = require("../Config");


class LoginService {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.loginApiUrl = Config.RootURL + "/api/sessions/login";
    }

    execute(onSuccess) {
        fetch(this.loginApiUrl, {
            method: "POST",
            body: "email=" + this.email + "&password=" + this.password
        })
            .then((response) => response.json())

            .then((responseJson) => {
                var data = null;
                if (responseJson.error == null) {
                    data = {
                        Success: true,
                        Token: responseJson.token
                    };
                }
                else {
                    data = {
                        Success: false
                    };
                }

                onSuccess(data);
            })
            .catch(function (err) {
                console.log("Exception error: " + err);
                onSuccess({Success: false });
            });

    }
}


module.exports = LoginService;
