# Starter #

Boilerplate для верстки проектов.

### Структура ###

* Таск раннер - [Gulp](http://gulpjs.com/)
* Сервер - [Express](http://expressjs.com/ru/guide/routing.html)
* Препроцессор [Less](http://lesscss.org/)
* Шаблонизатор [Nunjucks](https://mozilla.github.io/nunjucks/)

#### Config ####

Файл конфига лежит в корне проекта.

``` 
{
	"devStatic": "/",
	"buildStatic": "/",
	"buildDir": "build",
	"port": 8080,
	"dpe": false,
	"commonData": ["data"],
	"bildAddOn": [],
	"pages": [
		{
			"name": "index",
			"route": "/",
			"pageData": ["index"],
			"pageVars": {
				"test": 123,
				"foo": "bar",
				"loop": 1,
				"bool": true
			}
		}
	]
}

 ```

- devStatic  - Путь до папки с ассетами. по умолчнию равен '/'
- buildStatic  - Путь до папки с ассетами для готовой сборки. по умолчнию равен '/'
- buildDir  - Имя папки в которую будет все собираться. Если поменяли это значение, не забудьте добавить вашу новую директорию в гитигнор.
- port - порт на котором будет запущен сервер
- commonData - список имен файлов, которые будут передавться во все компилируемы шаблоны. Файлы должны лежать в корне папки 'datasource'
- pages - Список страниц проекта. В него передается объект следующего вида: 

	```
	{
		"name": "index",
		"route": "/",
		"pageData": [],
		"pageVars": {}
	}

	```
--  name - Имя фала с шаблоном