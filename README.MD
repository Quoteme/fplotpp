# Function Plotter ++ #

Plot your favorite functions in all their complex glory!

online: [http://htmlpreview.github.io/?https://github.com/Quoteme/fplotpp/blob/master/index.html](http://htmlpreview.github.io/?https://github.com/Quoteme/fplotpp/blob/master/index.html)
mobile builds: [https://build.phonegap.com/apps/3432607/share](https://build.phonegap.com/apps/3432607/share)

![demo.png](https://i.imgur.com/dIf7dkY.png)

for recursive functions use the "javascript mode". Simply add `` braces around your function and your expression will not be evaluated by math.js,
but instead using the default JavaScript evaluator. To reference your own function, call it with "f"

	x^2 // normal expression
	`if(x<=0){return 0}else{return 1}` // sign function, using JavaScript
	`if(x<=2){return 1}else{return (f(x-1)+f(x-2))}` // fibonacci sequence
