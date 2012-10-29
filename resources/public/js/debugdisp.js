"use strict";

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

$ (function() {

    var playerid = $.urlParam("id");

    var BoardRowModel = Backbone.Model.extend({});

    var BoardRowCollection = Backbone.Collection.extend({
        model: BoardRowModel,
        url: "/boarddebug?id=" + playerid
    });

    var BoardRowView = Backbone.View.extend({
        tagName: "tr",

        render: function() {
            var self = this;
            $.each(this.model.get("row"),function(index,value) {
                var displaystr = value;
                if (value === "u") {
                    displaystr = "?";
                }
                self.$el.append("<td>" + displaystr + "</td>");
            });
            return this;
        }
    });

    var board = new BoardRowCollection;

    var BoardTableView = Backbone.View.extend({
        initialize: function() {
            board.bind("reset",this.updateTable,this);
            board.fetch();
            /*window.setInterval(function() {
                scores.fetch();
            },5000);*/

        },

        updateTable: function() {
            var boardRow = $("#boardRow");
            boardRow.html(" ");
            board.each(function(row) {
                var rowView = new BoardRowView({model: row});
                boardRow.append(rowView.render().el);
            });
        }
    });

    var HeadingView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.append("<h1>Hello " + this.model.get("playerId") + "</h1>");
        }
    });

    var CommandsView = Backbone.View.extend({
        tagName: "div",

        template: _.template($('#commandTemplate').html()),

        el: $("#commandsPart"),

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var DebugDisplayView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            var boardView = new BoardTableView({el: $("#boardTable")});

            var headView = new HeadingView({
                model: new Backbone.Model({
                    playerId: self.model.get("playerId")
                }),
                el: $("#heading")
            });


            var commandsView = new CommandsView({
                model: new Backbone.Model({
                    playerId: self.model.get("playerId"),
                    host : self.model.get("host")
                })
            });
        }
    });



    var mainModel = new Backbone.Model({
        playerId: $.urlParam("id"),
        host: window.location.origin
    });

    var mainView = new DebugDisplayView({
        model: mainModel
    });


    //$("#idhere").html($.urlParam("id"));

});