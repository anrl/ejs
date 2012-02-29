{{var JsonMLWalker=require("../../jsonml/grammars/jsonml_walker.ojs");var _=require("../nodes");var join=require("../../utils.js")["join"];var stmt=require("../utils.js")["stmt"];var expr=require("../utils.js")["expr"]}var EJSTranslator=JsonMLWalker.inherit({_grammarName: "EJSTranslator",
"implicit_return":function(){var body;return (function(){body=this._apply("walk");return this["helpers"].implicit_return(body)}).call(this)},
"LambdaExpr":function(){var body,n,args;return (function(){n=this._apply("anything");args=this._apply("walk");body=this._apply("implicit_return");return _.Function(args,body)}).call(this)},
"Function":function(){var body,n,args;return (function(){n=this._apply("anything");args=this._apply("walk");body=this._apply("walk");return this["rules"].Function(n,args,body)}).call(this)},
"SliceExpr":function(){var fromExpr,toExpr,n,memberExpr;return (function(){n=this._apply("anything");memberExpr=this._apply("walk");fromExpr=this._apply("walk");toExpr=this._apply("walk");return this._or((function(){return (function(){this._pred((toExpr.hasType("Id") && toExpr.is("value","$")));return expr(memberExpr,".slice(",fromExpr,")")}).call(this)}),(function(){return (function(){this._apply("empty");return expr(memberExpr,".slice(",fromExpr,",",toExpr,")")}).call(this)}))}).call(this)},
"ExtendExpr":function(){var n,memberExpr,obj;return (function(){n=this._apply("anything");memberExpr=this._apply("walk");obj=this._apply("walk");return expr("Object.extend(",memberExpr,", ",obj,")")}).call(this)},
"PrototypeExpr":function(){var base,n,ext;return (function(){n=this._apply("anything");ext=this._apply("walk");base=this._apply("walk");return expr(base,".proto(",ext,")")}).call(this)},
"StringExpr":function(){var n,els;return (function(){n=this._apply("anything");els=this._many((function(){return this._apply("walk")}));return expr(_.ArrayExpr(els),".join(\"\")")}).call(this)},
"ScopeExpr":function(){var n,block;return (function(){n=this._apply("anything");block=this._apply("walk");return stmt("(function()",block,")()")}).call(this)},
"ClassStmt":function(){var n,constr,spec,sections;return (function(){n=this._apply("anything");sections=this._apply("walk");spec=this._apply("walk");constr=this._apply("walk");return this["rules"].ClassStmt(n,sections,spec,constr)}).call(this)},
"DebugStmt":function(){var n,block;return (function(){n=this._apply("anything");block=this._apply("walk");return stmt("if(typeof $DEBUG != \"undefined\")",block)}).call(this)},
"ModuleStmt":function(){var n,impl;return (function(){n=this._apply("anything");impl=this._apply("walk");return stmt("Object.define_module(\'",n.name(),"\', function()",impl,");")}).call(this)},
"ForOfStmt":function(){var vars,stmt,n,collExpr;return (function(){n=this._apply("anything");vars=this._apply("walk");collExpr=this._apply("walk");stmt=this._apply("walk");return this["rules"].ForOfStmt(n,vars,collExpr,stmt)}).call(this)},
"ForInStmt":function(){var vars,stmt,n,collExpr;return (function(){n=this._apply("anything");vars=this._apply("walk");collExpr=this._apply("walk");stmt=this._apply("walk");return this["rules"].ForInStmt(n,vars,collExpr,stmt)}).call(this)}});(EJSTranslator["force_rules"]=false);(EJSTranslator["helpers"]=({"implicit_return": (function (body){{var allowed=["String","Id","Number","Function"];var statements=body.children()};if((statements["length"] == (0))){return body}else{undefined};{var last=statements.pop();var type=last.type()};if(((allowed.indexOf(type) !== (- (1))) || type.match(/Expr$/))){(last=_.ReturnStmt(last))}else{undefined};statements.push(last);return _.BlockStmt(statements)})}));(EJSTranslator["rules"]=({"Function": (function (node,args,body){if((! args.has("rest"))){return node}else{undefined};var arg_count=(args["length"] - (2)).toString();var rest=stmt("var ",args.rest(),"=[].slice.call(arguments,",arg_count,")");body.splice((2),(0),rest);(node[(2)]=args);(node[(3)]=body);return node}),"ClassStmt": (function (node,sections,spec,constr){if(((! node.has("parent")) || node.is("parent",""))){var parent_name="undefined"}else{var parent_name=join("\"",node.parent(),"\"")};if((constr === undefined)){(constr="undefined")}else{undefined};return stmt("Object.define_class(\"",node.name(),"\", {","parent_name: ",parent_name,",","get_parent: function() { return ",node.parent(),"},","set_class: function(__class__) { ",node.name(),"=__class__},","constructor:",constr,",","sections:",sections,",","spec:",spec,"})")}),"ForOfStmt": (function (node,vars,collExpr,statement){{var key=vars[(2)];var el=vars[(3)]};if((el !== undefined)){var el_assign=stmt("var ",el,"=",collExpr,"[",key,"];");if(statement.hasType("BlockStmt")){statement.splice((2),(0),el_assign)}else{(statement=_.BlockStmt([el_assign,statement]))}}else{undefined};return stmt("for( var ",key," in ",collExpr,") {","if(",collExpr,".hasOwnProperty(",key,"))",statement,"}")}),"ForInStmt": (function (node,vars,collExpr,statement){{var key=vars[(2)];var el=vars[(3)]};if((el === undefined)){return node}else{return stmt("for( var ",key," in ",collExpr,") {","var ",el,"=",collExpr,"[",key,"];",statement,"}")}})}));(EJSTranslator["translate"]=(function (input){return EJSTranslator.match(input,"walk")}));var ImplicitReturn=JsonMLWalker.inherit({_grammarName: "ImplicitReturn",
"assureBlock":function(){var n;return (function(){n=this._apply("anything");return this._or((function(){return (function(){this._pred(n.hasType("BlockStmt"));return this._applyWithArgs("transform",n)}).call(this)}),(function(){return this._applyWithArgs("transform",_.BlockStmt([n]))}))}).call(this)},
"transform":function(){var props,t,el,first,last;return (function(){this._form((function(){return (function(){t=this._apply("anything");props=this._apply("anything");first=this._many((function(){return (function(){el=this._apply("anything");this._lookahead((function(){return this._apply("anything")}));return el}).call(this)}));return last=this._apply("walk")}).call(this)}));return _.BlockStmt(first.concat([last]))}).call(this)},
"implicit":function(){var n;return (function(){n=this._apply("anything");return _.ReturnStmt(n)}).call(this)},
"Id":function(){return this._apply("implicit")},
"Number":function(){return this._apply("implicit")},
"String":function(){return this._apply("implicit")},
"RegExpr":function(){return this._apply("implicit")},
"ObjectExpr":function(){return this._apply("implicit")},
"ArrayExpr":function(){return this._apply("implicit")},
"Function":function(){var n;return (function(){n=this._apply("anything");return this._or((function(){return (function(){this._pred(n.is("expr"));return this._applyWithArgs("implicit",n)}).call(this)}),(function(){return (function(){this._apply("empty");return n}).call(this)}))}).call(this)},
"SequenceExpr":function(){return this._apply("implicit")},
"CondExpr":function(){return this._apply("implicit")},
"BinaryExpr":function(){return this._apply("implicit")},
"UpdateExpr":function(){return this._apply("implicit")},
"NewExpr":function(){return this._apply("implicit")},
"CallExpr":function(){return this._apply("implicit")},
"MemberExpr":function(){return this._apply("implicit")},
"ThisExpr":function(){return this._apply("implicit")},
"GroupExpr":function(){return this._apply("implicit")},
"IfStmt":function(){var f,t,n,c;return (function(){n=this._apply("anything");c=this._apply("anything");t=this._apply("assureBlock");this._opt((function(){return f=this._apply("assureBlock")}));return _.IfStmt(c,t,f)}).call(this)}});(module["exports"]=EJSTranslator)}