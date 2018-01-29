var app;
(function(){
    app = angular.module('chatApp', []);
    
    app.controller('mainContrl', ['$scope','$http', function ($scope, $http) {
        $scope.loginObj = {};
        $scope.isSignUp = 'false';
        $scope.socket = io.connect();
        $scope.objWrappers = {
            mainWrap : $('.main-wrapper'),
            contentWrap : $('.content-wrapper'),
            loginWrap : $('.login-container'),
            signUpWrap : $('.signUp-wrapper')
        };
        $scope.objSelectors = {
            header : $scope.objWrappers.mainWrap.find('header'),
            footer : $scope.objWrappers.mainWrap.find('footer'),
            chatEntries : $scope.objWrappers.contentWrap.find("#chatEntries"),
            msgTextBox : $scope.objWrappers.contentWrap.find('#messageInput'),
            sendMsg : $scope.objWrappers.contentWrap.find('#submit')
        };

        $scope._fnAddMessage = function(msg) {
            $scope.objSelectors.chatEntries.append('<div class="message"><p> : ' + msg + '</p></div>');
        };

        $scope._fnSentMessage = function(e) {
            e.preventDefault();
            if ($scope.objSelectors.msgTextBox.val() != ""){
                $scope.socket.emit('message', $scope.objSelectors.msgTextBox.val());
                _fnAddMessage($scope.objSelectors.msgTextBox.val(), "Me", new Date().toISOString(), true);
                $scope.objSelectors.msgTextBox.val('');
            }
        };

        $scope._fnShowNoOfOnlineUsers = function(data){
            console.log('data::',data.description);
        };

        $scope._fnSetWindowHeight = function(){
            $('.content-wrapper,.login-container,.signUp-wrapper').css('height', function(){
                var headHt = $scope.objSelectors.header.outerHeight(),
                    footHt = $scope.objSelectors.footer.outerHeight(),
                    winHt = $scope.objWrappers.mainWrap.height();

                return (winHt - headHt - footHt) + 'px';
            });
        };

        $scope._fnSetListners = function(){
            $scope.socket.on('message', function(msg){
                $scope._fnAddMessage(msg);
            });

            $scope.socket.on('noOfUsers', function(msg){
                $scope._fnShowNoOfOnlineUsers(msg);
            });
        };

        $scope.getLoginStatus = function(){
            var isLoggedIn = window.localStorage.getItem('isSignedIn');
            if(isLoggedIn && isLoggedIn === "true"){
                $scope.isSignedIn = 'true';
            }else{
                $scope.isSignedIn = 'false';
            }
        };

        $scope.setStorageValues = function(store,value){
            if(typeof store === 'object' && store.length === undefined && value){
                for(var x in store){
                    window.localStorage.setItem(x,store[x]);    
                }
            }else{
                window.localStorage.setItem(store,value);
            }
        };

        $scope.signUp = function(){
            $scope.isSignUp = 'true';
            $scope._fnSetWindowHeight();
        };

        $scope.cancelSignUp = function(){
            $scope.isSignUp = 'false';
            $scope._fnSetWindowHeight();
        };

        $scope.login = function(){
            $http.post('http://localhost:3000/login',$scope.loginObj).then(function (res) {
                if(res.data.status === true){
                    $scope.setStorageValues(res.data.response);
                    $scope.isSignedIn = 'true';
                    $scope._fnSetWindowHeight();
                }else{
                    alert(res.data.response);
                }
            },function(err){
                alert("An error occured while processing the data");
            });
        };

        $scope.logOut = function(){
            $scope.loginObj = {};
            window.localStorage.clear();
            $scope.isSignedIn = 'false';
            $scope._fnSetWindowHeight();
        };

        $(document).ready(function(){
            $scope.getLoginStatus();
            $scope._fnSetWindowHeight();
            $scope._fnSetListners();
        });

        $(window).resize($scope._fnSetWindowHeight);
    }]);
})();