'use strict';

const gulp=require('gulp');
const $=require('gulp-load-plugins')();

const url=require('url');
const fs=require('fs');
const http=require('http');
const request=require('request');
const cssnext=require('postcss-cssnext');
const mainbowerfiles=require('main-bower-files');
const del=require('del');

function getUrltoFile(urlSource,fileName){
	let options={
		host:url.parse(urlSource).hostname,
		path:url.parse(urlSource).pathname+decodeURIComponent(url.parse(urlSource).search||'')
	}

	let request=http.request(options,function(res){
		let data='';
		res.on('data',function(chunk){
			data+=chunk;
		});
		res.on('end',function(){
			fs.writeFile(fileName,data,function(err){
				if(err){
					return console.log(err);
				}
				console.log(`${urlSource} writen to ${fileName}`);
			});
		});
	});
	request.on('error',function(e){
		console.log(e.message);
	});
	request.end();
}

gulp.task('origami',function(){
	getUrltoFile('http://origami-build.ft.com/v2/bundles/js?modules=o-gallery@^1.7.6','app/origami/o-gallery.js');
	getUrltoFile('http://origami-build.ft.com/v2/bundles/css?modules=o-gallery@^1.7.6','app/origami/o-gallery.css');
});

function getBodyFromUrl(urlSource,fileName){
	let options={
		host:url.parse(urlSource).hostname,
		path:url.parse(urlSource).pathname+decodeURIComponent(url.parse(urlSource).search||'')
	}
	console.log(options.path);
	let req=http.request(options,function(res){
		let data='';
		res.on('data',function(chunk){
			data+=chunk;
		});
		res.on('end',function(){
			let pattern=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
			let array_matches=pattern.exec(data);
			console.log(`array_matches[0]:+${array_matches[0]}`);
			let fileContent=fs.readFileSync('app/index.html','utf8');
			fileContent=fileContent.replace(pattern,array_matches[0]);

			fs.writeFile(fileName,fileContent,function(err){
				if(err){
					return console.log(err);
				}
				console.log(`${urlSource} writen to ${fileName}`)
			})
		})
	});
	req.on('error',function(e){
		console.log(e.message);
	});
	req.end();
}

gulp.task('home',function(){
	var thedatestamp=new Date().getTime();
	getBodyFromUrl('http://www.ftchinese.com/m/corp/p0.html?'+thedatestamp,'index.html')
})

gulp.task('copy', ['build'], function () {

  var thedatestamp = new Date().getTime();

  gulp.src('app/origami/*.css')
    .pipe(gulp.dest('../dev_www/frontend/static/n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/styles'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/styles'));
  
  gulp.src('app/origami/*.js')
    .pipe(gulp.dest('../dev_www/frontend/static/n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/scripts'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/scripts'));

  gulp.src('dist/styles/*.css')
    .pipe(gulp.dest('../dev_www/frontend/static/n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/styles'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/styles'));

  gulp.src('dist/styles/partials/*.css')
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/styles'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/styles'));

  gulp.src('dist/scripts/*.js')
    .pipe(gulp.dest('../dev_www/frontend/static/n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/scripts'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/scripts'));

  gulp.src('dist/m/marketing/*')
    .pipe(gulp.dest('../dev_www/frontend/tpl/marketing'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/marketing'));

  gulp.src('app/api/page/*')
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/api/page'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/api/page'));

  gulp.src('dist/**/*')
    .pipe(gulp.dest('../dev_cms/pagemaker'))
    .pipe(gulp.dest('../testing/dev_cms/pagemaker'));

  gulp.src('app/api/**/*')
    .pipe(gulp.dest('../dev_cms/pagemaker/api'))
    .pipe(gulp.dest('..testing/dev_cms/pagemaker/api'));

  gulp.src('app/templates/p0.html')
    .pipe($.replace(/([\r\n])[ \t]+/g, '$1'))
    .pipe($.replace(/(\r\n)+/g, '\r\n'))
    .pipe($.replace(/(\n)+/g, '\n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/corp'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/corp'));

  gulp.src('app/templates/partials/**/*')
    .pipe($.replace(/([\r\n])[ \t]+/g, '$1'))
    .pipe($.replace(/(\r\n)+/g, '\r\n'))
    .pipe($.replace(/(\n)+/g, '\n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/partials'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/partials'));

  gulp.src('app/templates/html/**/*')
    .pipe($.replace(/([\r\n])[ \t]+/g, '$1'))
    .pipe($.replace(/(\r\n)+/g, '\r\n'))
    .pipe($.replace(/(\n)+/g, '\n'))
    .pipe(gulp.dest('../dev_www/frontend/tpl/next/html'))
    .pipe(gulp.dest('../testing/dev_www/frontend/tpl/next/html'));


  var fileName = '../dev_www/frontend/tpl/next/timestamp/timestamp.html';
  var fileName2 = '../testing/dev_www/frontend/tpl/next/timestamp/timestamp.html';
  //var fs = require('fs');
  fs.writeFile(fileName, thedatestamp, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(`${thedatestamp} write to ${fileName}`);
     
  });
  fs.writeFile(fileName2, thedatestamp, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(`${thedatestamp} write to ${fileName}`);
  ;
  });

});


gulp.task('story', function () {
  let thisday = new Date();
  let theyear = thisday.getFullYear();
  let themonth = thisday.getMonth() + 1;
  let theday =  thisday.getDate();
  let thedatestamp = theyear + '-' + themonth + '-' + theday;


  let urlSource = 'https://backyard.ftchinese.com/falcon.php/cmsusers/login';

  let options = {
      host: url.parse(urlSource).hostname,
      path: url.parse(urlSource).pathname + unescape(url.parse(urlSource).search || '')
  }

request.post({
    url: 'https://backyard.ftchinese.com/falcon.php/cmsusers/login',
    form: {"username":"", "password":""},
    headers: {
      'User-Agent': 'request'
    }
}, function(error, response, body){
	    let storyapi = 'https://backyard.ftchinese.com/falcon.php/homepage/getstoryapi/' + thedatestamp;

	    let headers = {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
			'Cache-Control':'max-age=0',
			'Connection':'keep-alive',
			'Cookie':'FTSTAT_ok_times=22; _ga=GA1.3.637326541.1424081173; campaign=2015spring5; _gscu_2081532775=0.7.0.5%7C2483082596632ej013%7C1424859625967%7C8%7C3%7C27%7C0; __utma=65529209.637326541.1424081173.1449122460.1454643214.25; __utmz=65529209.1449122460.24.6.utmcsr=EmailNewsletter|utmccn=1D110215|utmcmd=referral; __utmv=65529209.visitor_DailyEmail; __gads=ID=cd878295be28de40:T=1454986613:S=ALNI_MbkpbmkeeFOrhk1DVu05zuKdgqPmw; SIVISITOR=Ni42NzQuOTg3MjQ2MjgyMzk4Ny4xNDU0OTg2NjE0Mzc0Li0xZDZkODE5Ng__*; ccode=1P110215; faid=97e09ef664648f4bcc02a418e06717d3; ftn_cookie_id=1455247531.176777595; PHPSESSID=f8b0d2f63c554af8a5c8ef8a79b4c4bb; _ga=GA1.2.637326541.1424081173; ftcms_uid=13; ftcms_username=oliver.zhang; ftcms_groups=editor',
			'Host':'backyard.ftchinese.com',
			'Upgrade-Insecure-Requests':'1'
	    }


	    request.get({
	        url: storyapi,
	        headers: headers
	    },function(error, response, body){
	        console.log(body);

	        let fileName = './app/api/page/stories.json';
	        let fs = require('fs');
	        fs.writeFile(fileName, body, function(err) {
	            if(err) {
	                return console.log(err);
	            }
	            console.log(`${storyapi} writen to ${fileName}`);
	        });
		});
	});
});

function postDatatoFile(urlSource,postData,fileName){
  let post_data=JSON.stringify(postData);
  let options={
    host:url.parse(urlSource).hostname,
    path:url.parse(urlSource).pathname+decodeURIComponent(url.parse(urlSource).search||''),
    method:'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':post_data.length
    }
  }
  let request=http.request(options,function(res){
    let data='';
    res.on('data',function(chunk){
      data+=chunk;
    });
    res.on('end',function(){
      fs.writeFile(fileName,data,function(err){
        if(err){
          return console.log(err);
        }
        console.log(`${urlSource} post data writen to ${fileName}`);
      })
    })
  })
  request.on('error',function(e){
    console.log(e.message);
  });
  request.write(post_data);
  request.end();
}

gulp.task('nav', function () {
  let message = {};
  message.head = {};
  message.head.transactiontype = '11001';
  message.head.source = 'web';
  message.body = {};
  message.body.ielement = {};

  postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/page/nav.json');
});


gulp.task('styles',function(){
  const DEST = '.tmp/styles';
  return gulp.src(['app/styles/main*.scss'])
    .pipe($.changed(DEST))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle:'expanded',
      precision:10,
      includePaths:['bower_components']
    })).on('error',$.sass.logError)
    .pipe($.postcss([
      cssnext({
        features:{
          colorRgba:false
        }
      })
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DEST));
});

gulp.task('ad',function(){
  return gulp.src('app/m/marketing/*')
    .pipe(gulp.dest('dist/m/marketing'));
});

gulp.task('jshint',function(){
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
})

gulp.task('html',['styles'],function(){
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath:['.tmp','app','.']}))
    .pipe($.if('*.js',$.uglify()))
    .on('error',$.util.log)
    .pipe($.if('*.css',$.cssnano()))
    .pipe($.if('*.html',$.htmlmin({
       collapseWhitespace:true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images',function(){
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive:true,
      interlaced:true
    })))
    .pipe(gulp.dest('dist/images'));
})

gulp.task('fonts',function(){
  return gulp.src(mainbowerfiles().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/font'));
})

gulp.task('clean',function(){
  return del(['.tmp/**','dist']).then(()=>{
    console.log('dir .tmp and dist deleted');
  })
})

gulp.task('connect',['styles'],function(){
  const serveStatic=require('serve-static');
  const serveIndex=require('serve-index');
  const app=require('connect')()
    .use(require('connect-livereload')({
        port:35729
    }))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    .use('/bower_components',serveStatic('bower_components/'))
    .use(serveIndex('app'));

  const http=require('http');
  http.createServer(app)
    .listen(9000,'0.0.0.0')
    .on('listening',function(){
       console.log('Started connect web server on http://localhost:9000');
    })

})