(function(){"use strict";importScripts("helpers.js","intadjoinsqrt2.js","point.js","lineSegement.js","directions.js","tan.js","evaluation.js","tangram.js");var p=new IntAdjoinSqrt2(50*FACTOR,0),m=50,P=function(e,a){for(var r=a.getPoints(),l=r.concat(a.getInsidePoints()),s=0;s<e.length;s++){for(var t=e[s].getPoints(),v=0,f=0;f<l.length;f++){var o=containsPoint(t,l[f]);if(o===1)return!1;o===0&&v++}if(v>=3)return!1;for(v=0,t=t.concat(e[s].getInsidePoints()),f=0;f<t.length;f++){if(o=containsPoint(r,t[f]),o===1)return!1;o===0&&v++}if(v>=3)return!1}for(var n=a.getSegments(),i=0;i<n.length;i++)for(s=0;s<e.length;s++)for(var u=e[s].getSegments(),g=0;g<u.length;g++)if(n[i].intersects(u[g]))return!1;var h=e.slice(0);h[e.length]=a;var c=computeBoundingBox(h);return!(c[2].dup().subtract(c[0]).compare(p)>0||c[3].dup().subtract(c[1]).compare(p)>0)},j=function(e){for(var a=0,r=0;r<e.length;r++)a+=e[r];if(!numberEq(a,0)){for(r=0;r<e.length;r++)e[r]/=a;return e}},q=function(e,a,r,l,s){for(var t=[],v=[],f=0;f<s.length;f++)s[f].point1.eq(a)?v.push(s[f].direction()):s[f].point2.eq(a)&&v.push(s[f].direction().neg());for(var o=0;o<numOrientations;o++)for(t.push(1),f=0;f<v.length;f++)v[f].multipleOf(SegmentDirections[r][o][l][0])&&(t[o]+=m),v[f].multipleOf(SegmentDirections[r][o][l][1])&&(t[o]+=m);return j(t)},y=function(e){var a=Math.random();if(e=e.slice(0),a<e[0])return 0;for(var r=1;r<numOrientations;r++)if(e[r]+=e[r-1],a<=e[r])return r;return numOrientations-1},O=function(e,a){var r=a.getPoints();return e=e.concat(r),eliminateDuplicates(e,comparePoints,!0)},w=function(e,a){for(var r=a.getPoints(),l=[],s=0;s<e.length;s++){for(var t=[],v=0;v<r.length;v++)e[s].onSegment(r[v])&&t.push(r[v]);l=l.concat(e[s].split(t))}return l=l.concat(a.getSegments()),l=eliminateDuplicates(l,compareLineSegments,!0),l},M=function(){var e=Math.floor(Math.random()*2),a=[0,0,1,2,2,3,4+e];a=shuffleArray(a);var r=Math.floor(Math.random()*numOrientations),l=[],s=new Point(new IntAdjoinSqrt2(30,0),new IntAdjoinSqrt2(30,0));l[0]=new Tan(a[0],s,r);for(var t=l[0].getPoints(),v=l[0].getSegments(),f=1;f<7;f++)for(var o=!1,n=0;!o;){s=t[Math.floor(Math.random()*t.length)].dup();var i=0,u=a[f]<3?[0,1,2]:[0,1,2,3];u=shuffleArray(u);do{for(var g,h=q(l,s,a[f],u[i],v);typeof h<"u"&&!o;){if(r=y(h),u[i]===0)g=new Tan(a[f],s,r);else{var c=s.dup().subtract(Directions[a[f]][r][u[i]-1]);g=new Tan(a[f],c,r)}P(l,g)&&(l[f]=g,o=!0,t=O(t,g),v=w(v,g)),h[r]=0,h=j(h)}i++}while(!o&&i<(a[f]<3?3:4));if(n++,n>100)return console.log("Infinity loop!"),M()}return new Tangram(l)},A=function(e){generating=!0;for(var a=[],r=0;r<e;r++){a[r]=M(),self.postMessage(r);for(var l=0;l<7;l++)delete a[r].tans[l].points,delete a[r].tans[l].segments,delete a[r].tans[l].insidePoints}a=a.sort(compareTangrams),generating=!1;for(var r=0;r<e;r++)self.postMessage(JSON.stringify(a[r].tans));self.postMessage("Generating done!")};self.addEventListener("message",function(e){var a=e.data;self.postMessage("Worker started!"),A(a)},!1)})();
