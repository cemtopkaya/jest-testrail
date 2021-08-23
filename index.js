const Jasmine = require('jasmine');
const jasmine = new Jasmine();

// Ayarlar için: https://jasmine.github.io/setup/nodejs.html
console.log('----------- Jasmine CONFIG ----------')
console.log(jasmine.env.configuration())
console.log('----------- /Jasmine CONFIG ----------\n')

jasmine.loadConfig({
  spec_dir: './',
  spec_files: [
    "desc.[sS]pec.js"
  ],
  // testleri sırasıyla çalıştır
  random: false,
  // Eğer expect yoksa doğrudan başarısız ilan et
  failSpecWithNoExpectations: true
});

// Reporter fonksiyonları için: https://jasmine.github.io/api/edge/Reporter.html

// jasmine.configureDefaultReporter({
//   print: function(result) {
//     /** Testleri çalıştırıp çıktılarını kendi içinde toplar ve tamamladığında
//      * print işlevini çalıştırır. Bize gelen özet bilgiyi stdout.write ile 
//      * ekrana yazdırıyoruz. 
//      * İstersek başka şeyler de yapabiliriz:
//      * - eposta ile bir yerlere gönder
//      * - bir dosyaya günlük kaydı olarak ekle
//      * gibi çeşitli amaçlar için kullanabilirsiniz
//      */
//     process.stdout.write(result);
//   },
//   showColors: true,
//   jasmineCorePath: this.jasmineCorePath
// });

// jasmine.jasmine.getEnv().addReporter(require('./ozelRaporcular/myReporter'));
// jasmine.jasmine.getEnv().addReporter(require('./ozelRaporcular/basitRaporcu'));
// const { TestRailReporter } = require('./ozelRaporcular/testrailReporter')
// TestRailReporter.createInstance('Ornek', true)
//   .then(reporter => {
//     jasmine.jasmine.getEnv().addReporter(reporter);
//     jasmine.execute();
//   })
//   .catch(err => {
//     console.error(' !!! createTestRailRaporcu hata fırlattı: ', err)
//   })

const { WithoutStep } = require('./ozelRaporcular/WithoutStep')
const ws = new WithoutStep()
jasmine.jasmine.getEnv().addReporter(ws);
jasmine.execute();

