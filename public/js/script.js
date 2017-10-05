(function() {
    var socket = io.connect(),
        objWrappers = {
            mainWrap : $('.main-wrapper'),
            contentWrap : $('.content-wrapper')
        },
        objSelectors = {
            header : objWrappers.mainWrap.find('header'),
            footer : objWrappers.mainWrap.find('footer'),
            chatEntries : objWrappers.contentWrap.find("#chatEntries"),
            msgTextBox : objWrappers.contentWrap.find('#messageInput'),
            sendMsg : objWrappers.contentWrap.find('#submit')
        },
        _fnAddMessage = function(msg) {
            objSelectors.chatEntries.append('<div class="message"><p> : ' + msg + '</p></div>');
        },
        _fnSentMessage = function(e) {
            e.preventDefault();
            if (objSelectors.msgTextBox.val() != ""){
                socket.emit('message', objSelectors.msgTextBox.val());
                _fnAddMessage(objSelectors.msgTextBox.val(), "Me", new Date().toISOString(), true);
                objSelectors.msgTextBox.val('');
            }
        },
        _fnShowNoOfOnlineUsers = function(data){
            console.log('data::',data.description);
        },
        _fnSetWindowHeight = function(){
            objWrappers.contentWrap.css('height', function(){
                var headHt = objSelectors.header.outerHeight(),
                    footHt = objSelectors.footer.outerHeight(),
                    winHt = objWrappers.mainWrap.height();

                return (winHt - headHt - footHt) + 'px';
            });
        },
        _fnSetListners = function(){
            socket.on('message', function(msg){
                _fnAddMessage(msg);
            });

            socket.on('noOfUsers', function(msg){
                _fnShowNoOfOnlineUsers(msg);
            });
        },
        _fnInit = function(){
            _fnSetWindowHeight();
            _fnSetListners();
            $(window).resize(_fnSetWindowHeight);
            objSelectors.sendMsg.click(_fnSentMessage);
        };

    $(document).ready(_fnInit);
})();
