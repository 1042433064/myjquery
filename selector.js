/**
 * Created by 谢康炎 on 2016/8/17.
 */
(function(window){
    // 将一些全局对象，传到框架中的局部变量中。
    // 好处：提高访问性能。
    var arrary=[];
    var push=arrary.push;
    var document=window.document;
    function itcast(selector){
        return new itcast.fn.init(selector);
    };
    itcast.fn=itcast.prototype={
      constructor:itcast,
        selector:"",
        length:0,
        init:function(selector,context){
            if(!selector) return this;
            if(itcast.isString(selector)){
                if(itcast.isHTML(selector)){
                    push.apply(this,itcast.parseHTML(selector))
                }else{
                    push.apply(this,select(selector,context));
                    this.selector=selector;
                    this.context=context||document;
                }
                return this;
            };
            if(itcast.isItcast(selector)) return selector;
            if(itcast.isFunction(selector)){
                var oldFn=window.onload;
                if(itcast.isFunction(oldFn)){
                    window.onload=function(){
                        oldFn();
                        selector();
                    }
                }else {
                  window.onload=selector();
                }
                return this;
            };
            if(itcast.isDOM(selector)){
                this[0]=selector;
                this.length=1;
                return this;
            };
            if(itcast.isArrayLike(selector)){
                push.apply(this,selector);
                return this;
            }
        },
        each:function(callback){
            itcast.each(this,callback);
            return this;
        },
        get:function(index){
            index=index*1;
            return window.isNaN(index)?undefined:this[index];
        }
    };
    // 可扩展方法
    itcast.extend=itcast.fn.extend=function(obj,target){
        if(obj&&typeof obj==="object"){
            target=target||this;
            for(var i in obj){
                target[i]=obj[i];
            }
        }
    };
    // 扩展类型判断方法
    itcast.extend({
        isString:function(obj){
            return !!obj&&typeof obj==="string";
        },
        isHTML:function(obj){
            var _o=itcast.trim(obj);
            return _o.charAt(0)==="<"&&_o.charAt(_o.length-1)===">"&&_o.length>=3;
        },
        isItcast:function(obj){
            return typeof obj==="object"&& "selector" in obj;
        },
        isFunction:function(obj){
            return typeof obj==="function";
        },
        isDOM:function(obj){
            return !!obj.nodeType
        },
        isWindow:function(obj){
            // window对象有一个特性，就是有一个window属性引用自己
            return window in obj&&obj.window===window;
        },
        isArrayLike:function(obj){
            if(itcast.isWindow(obj)||itcast.isFunction(obj)) return false;
            return "length" in obj&&obj.length>=0;
        }
    });
    // 扩展工具类方法
    itcast.extend({
        each:function(obj,callback){
            for(var i=0;i<obj.length;i++){
                if(callback.call(obj[i],obj[i],i)===false) break;
            }
        },
        trim:function(str){
            if(!str) return "";
            return str.replace(/^\s+|\s+$/g, '');
        },
        parseHTML:function(html){
            var res=[];
            var div=document.createElement("div");
            div.innerHTML=html;
            itcast.each(div.childNodes,function(){
                if(this.nodeType===1) res.push(this);
            })
            return res;
        }
    });
    // css module
    itcast.extend({
        setCss:function(dom,name,value){
            if(value!==undefined){
                dom.style[name]=value;
            }else if(typeof name==="object"){
                for(var k in name){
                    dom.style[k]=name[k];
                }
            }
        },
        getCss:function(dom,name){
            return document.defaultView&&document.defaultView.getComputedStyle?
                document.defaultView.getComputedStyle(dom)[name]:
                dom.currentStyle[name];
        },
        hasClass:function(dom,className){
            return (" "+dom.className+" ").indexOf(" "+itcast.trim(className)+" ")>-1?
                true:false;
        },
        addClass:function(dom,className){
            var _classname=dom.className;
            if(!_classname) dom.className=className;
            else{
                if(!itcast.hasClass(dom,className))
                dom.className+=" "+className;
            }
        },
        removeClass:function(dom,className){
            dom.className=itcast.trim((" "+dom.className+" ")
                .replace(" "+itcast.trim(className)+" "," "));
        },
        toggleClass:function(dom,className){
            if(itcast.hasClass(dom,className)){
                itcast.removeClass(dom,className);
            }else{
                itcast.addClass(dom,className);
            }
        }
    });
    itcast.fn.extend({
        css:function(name,value){
            if(value===undefined){
                if(typeof name==="object"){
                    return this.each(function(){
                        itcast.setCss(this,name);
                    })
                }else{
                    return this.length>0?itcast.getCss(this[0],name):
                        undefined;
                }
            }else{
                return this.each(function(){
                    itcast.setCss(this,name,value);
                })
            }
        },
        hasClass:function(className){
            return this.length>0?itcast.hasClass(this[0],className):
                false;
        },
        addClass:function(className){
            return this.each(function(){
                itcast.addClass(this,className);
            })
        },
        removeClass:function(className){
            return this.each(function(){
                if(className===undefined){
                    this.className="";
                }else{
                    itcast.removeClass(this,className);
                }
            })
        },
        toggleClass:function(className){
            return this.each(function(){
                itcast.toggleClass(this,className);
            })
        }
    })
    // attr module
    itcast.extend({
        setAttr:function(dom,name,value){
            dom.setAttribute(name,value);
        },
        getAttr:function(dom,name){
            return dom.getAttribute(name);
        },
        setHTML:function(dom,html){
            dom.innerHTML=html;
        },
        getHTML:function(dom){
            return dom.innerHTML;
        },
        setval:function(dom,v){
            dom.value=v;
        },
        getval:function(dom){
            return dom.value;
        },
        setText:function(elem,txt){
            if(elem.textContent){
                elem.textContent=txt;
            }else{
                elem.innerHTML="";
                elem.appendChild(document.createTextNode(txt));
            }
        },
        getText:function(elem){
            return typeof elem.textContent==="string"?
                elem.textContent:
                elem.innerText;
        }
    });
    itcast.fn.extend({
        attr:function(name,value){
            if(value===undefined){
                return this.length>0?itcast.getAttr(this[0],name):
                    undefined;
            }else{
                return this.each(function(){
                    itcast.setAttr(this,name,value);
                })
            }
        },
        html:function(html){
            if(html===undefined){
                return this.length>0?itcast.getHTML(this[0]):undefined;
            }else{
                return this.each(function(){
                    itcast.setHTML(this,html);
                })
            }
        },
        val:function(v){
            if(v===undefined){
                return this.length>0?itcast.getval(this[0]):undefined;
            }else{
                return this.each(function(){
                    itcast.setval(this,v);
                })
            }
        },
        text:function(txt){
            if(txt===undefined){
                return this[0]&&itcast.getText(this[0]);
            }else{
                return this.each(function(){
                    itcast.setText(this,txt);
                })
            }
        },
        appendTo:function(taggle){
            var taggle=itcast(taggle);
            var res=[];
            var self=this;
            taggle.each(function(elem,i){
                self.each(function(){
                    var node=i===0?this:this.cloneNode(true);
                    elem.appendChild(node);
                    res.push(node);
                })
            })
            return itcast(res);
        },
        append:function(source){
            itcast(source).appendTo(this);
            return this;
        },
        prependTo:function(target){
            var target=itcast(target);
            var res=[];
            var node;
            var firstnode;
            var self=this;
            target.each(function(elem,i){
                    firstnode=this.firstChild;
                self.each(function(){
                    node=i===0?this:this.cloneNode(true);
                    elem.insertBefore(node,firstnode);
                    res.push(node);
                })
            })
            return res;
        },
        prepend:function(source){
            itcast(source).prependTo(this);
            return this;
        },
        remove:function(){
            return this.each(function(){
                this.parentNode.removeChild(this);
            })
        },
        empty:function(){
            return this.each(function(){
                this.innerHTML="";
            })
        },
        next:function(){
            var res=[];
            var node;
            this.each(function(){
                for(node=this.nextSibling;node;node=node.nextSibling){
                    if(node.nodeType===1){
                        res.push(node);
                        break;
                    }
                }
            })
            return itcast(res);
        },
        nextAll:function(){
            var res=[];
            var node ;
            this.each(function(){
                for(node=this.nextSibling;node;node=node.nextSibling){
                    if(node.nodeType===1){
                        res.push(node);
                    }
                }
            })
            return itcast(res);
        },
        before:function(elem){
            var node,elem=itcast(elem);
            return this.each(function(dom,i){
                elem.each(function(){
                    node=i===0?this:this.cloneNode(true);
                    dom.parentNode.insertBefore(node,dom);
                })
            })
        },
        after:function(elem){
            var node,elem=itcast(elem),nextnode;
            return this.each(function(dom,i){
                nextnode=dom.nextSibling;
                elem.each(function(){
                    node=i===0?this:this.cloneNode(true);
                    if(dom.nextSibling){
                        dom.parentNode.insertBefore(node,nextnode);
                    }else{
                        dom.parentNode.appendChild(node);
                    }
                })
            })
        },
        on:function(type,callback){
           return this.each(function(){
                if(window.addEventListener){
                    this.addEventListener(type,callback)
                }else{
                    this.attachEvent("on"+type,callback);
                }
            })
        },
        off:function(type,callback){
            return this.each(function(){
                if(window.removeEventListener){
                    this.removeEventListener(type,callback);
                }else{
                    this.detachEvent("on"+type,callback);
                }
            })
        }
    });
    itcast.each('click dbclick mouseover mouseout mouseenter mouseleave keydown keyup keypress blur focus'.split(" "),
    function(e,i){
         itcast.fn[this]=function(callback){
    return this.on(e,callback);
}
})
    var select=(function(){
        var rnative = /^[^{]+\{\s*\[native \w/;
        var rquickExpr=/^(?:#([\w-]+)|\.([\w-]+)|(\w+)|(\*))$/;
        var support={
            getelementsByClassName:rnative.test(document.getElementsByClassName)
        };
        function select(selector,context,results){
                results=results||[];
                each(selector.split(","),function(){
                    var res=context;
                  each(this.split(" "),function(){
                      res=get(this.valueOf(),res);

                  });
                    results.push.apply(results,res);
                })
            return results;
        };
        function get(selector,context,results){
            context=context||document;
            var math=rquickExpr.exec(selector);
            if(math){
                if(math[1]){
                    results=getId(math[1]);
                }
                var nodety=context.nodeType;
                if(nodety===1||nodety===9||nodety===11) context=[context];
                else if(typeof context==="string"){
                    context=get(context);
                };
                each(context,function(){
                    if(math[2]){
                        results=getClass(math[2],this,results);
                    }else if(math[3]){
                        results=getTag(math[3],this,results);
                    }else if(math[4]){
                        results=getTag("*",this,results);
                    }
                })
            }
            return results;
        };
        function getId(selector,results){
            results=results||[];
            var node=document.getElementById(selector);
            if(node) results.push(node);
            return results;
        };
        function getClass(selector,context,results){
            results=results||[];
            if(support){
                results.push.apply(results,context.getElementsByClassName(selector));
            }else{
                var node=getTag("*",context);
                each(node,function(){
                    if((" "+this.className+" ").indexOf(" "+trim(selector)+" ")>-1){
                        results.push(this);
                    }
                })
            }
            return results;
        };
        function getTag(selector,context,results){
            results=results||[];
            results.push.apply(results,context.getElementsByTagName(selector));
            return results;
        }
        function each(arr,callback){
            for(var i=0;i<arr.length;i++){
                if(callback.call(arr[i],arr[i],i)===false) break;
            }
        };
        function trim(str){
            return str.replace(/^\s+|\s+$/g,"");
        }
        return select
    }());
    itcast.fn.init.prototype=itcast.fn;
    window.I=window.itcast=itcast;
}(window))















