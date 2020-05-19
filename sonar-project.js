const serverUrl = process.env.SONARQUBE_URL;
console.log("SERVER URL" + serverUrl);
console.log("process.env" + process.env.SONARQUBE_URL);
const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl,
        options : {
            'sonar.login': process.env.SONARQUBE_USER,
            'sonar.password': process.env.SONARQUBE_PASSWORD,
            'sonar.sources':  './',
            'sonar.tests':  './',
            'sonar.inclusions'  :  '**', // Entry point of your code
            'sonar.test.inclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
            'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
            'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml',
        },
    }, () => {});

