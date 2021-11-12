if(window.minesweeper === undefined)
  window.minesweeper = {};

window.minesweeper.customBoardSize = function(settings = {}) {
  if(settings.easy === undefined)
    settings.easy = {
      width: 50,
      height: 8,
      mines: 200,
      squareSize: 12,
    };
  if(settings.medium === undefined)
    settings.medium = {
      width: 50,
      height: 50,
      mines: 50,
      squareSize: 12,
    };
  if(settings.hard === undefined)
    settings.hard = {
      width: 24,
      height: 20,
      mines: 479,
      squareSize: 25,
    };

  const scripts = document.body.getElementsByTagName('script');
  for(let script of scripts) {
    const req = new XMLHttpRequest();
    req.open('GET', script.src);

    req.onload = function() {
      if(this.responseText.indexOf('#A2') !== -1)
        processCode(this.responseText);
    };

    req.send();
  }
  
  
  const processCode = function(code) {
    const bigManClassOrConstructorFunctionOrWhateverShutUp = code.match(
      /[a-zA-Z0-9_$]{1,6}=function\(a\){[a-zA-Z0-9_$]{1,6}\.call\(this,a\.[a-zA-Z0-9_$]{1,6}\);var b=this;[^}]*?"MEDIUM"[^]*?this\.[a-zA-Z0-9_$]{1,6}&&\(this\.[a-zA-Z0-9_$]{1,6}\(\),this\.[a-zA-Z0-9_$]{1,6}\(\)\)}/
    )[0];

    // console.log(bigManClassOrConstructorFunctionOrWhateverShutUp);

    const mineso = bigManClassOrConstructorFunctionOrWhateverShutUp.match(
      /this\.[a-zA-Z0-9_$]{1,6}\.EASY=10;/
    )[0].replace(/this\.|\.EASY=10;/g, '');

    const t = bigManClassOrConstructorFunctionOrWhateverShutUp.match(
      /this\.[a-zA-Z0-9_$]{1,6}\.EASY=new [a-zA-Z0-9_$]{1,6}\(10,8\);/
    )[0];
    const sizeso = t.replace(/this\.|\.EASY=[^;]*?;/g, '');
    const sizesf = t.replace(/this\.[a-zA-Z0-9_$]{1,6}\.EASY=new |\(10,8\);/g, '');

    const idekWhatThisIsReallyButIThinkIShouldMessWithIto = bigManClassOrConstructorFunctionOrWhateverShutUp.match(
      /this\.[a-zA-Z0-9_$]{1,6}\.EASY=45;/
    )[0].replace(/this\.|\.EASY=45;/g, '');

    eval(
      code.match(
        /[a-zA-Z0-9_$]{1,6}\.prototype\.[a-zA-Z0-9_$]{1,6}=function\(\){var a=this;this\.[a-zA-Z0-9_$]{1,6}=!1;var b=[a-zA-Z0-9_$]{1,6}\(\);[^]*?height\+60[^]*?return b\.promise}/
      )[0].replace(
        'var a=this;',
        `
          var a=this;
          a.${sizeso}.EASY = new ${sizesf}(${settings.easy.width}, ${settings.easy.height});
          a.${sizeso}.MEDIUM = new ${sizesf}(${settings.medium.width}, ${settings.medium.height});
          a.${sizeso}.HARD = new ${sizesf}(${settings.hard.width}, ${settings.hard.height});

          a.${mineso}.EASY = ${settings.easy.mines};
          a.${mineso}.MEDIUM = ${settings.medium.mines};
          a.${mineso}.HARD = ${settings.hard.mines};

          a.${idekWhatThisIsReallyButIThinkIShouldMessWithIto} = {
            EASY: ${settings.easy.squareSize || 45},
            MEDIUM: ${settings.medium.squareSize || 30},
            HARD: ${settings.hard.squareSize || 25},
          };
        `
      )
    );
  };
  
};