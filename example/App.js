import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import jile from '../src';

const GLOBAL_STYLES = {
  '.container': {
    backgroundColor: 'yellow',
    height: '100vh'
  }
};
const SCOPED_STYLES = {
  'html, body': {
    margin: 0,
    padding: 0
  },
  '.selector': {
    display: 'inline-block'
  },
  '.parent': {
    fontSize: 18,
    padding: 15,

    '& .child': {
      fontSize: 12
    },

    '&::before': {
      backgroundColor: '#fff',
      content: '"I am a pseudo element! Weeeeee!"',
      display: 'block'
    },

    '& .crazyAnimation': {
      animation: '10s crazyStuff infinite',
      fontSize: 24,
      transformOrigin: 'left center'
    },

    '@media screen and (max-width: 999px)': {
      backgroundColor: 'lightgray',

      '& .child': {
        fontSize: 28
      }
    },

    '@media screen and (min-width: 1000px)': {
      backgroundColor: 'blue',

      '& .child': {
        fontSize: 32
      }
    }
  },

  '@keyframes crazyStuff': {
    '0%': {
      opacity: 0,
      transform: 'scale(0)'
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1)'
    },
    '100%': {
      opacity: 0,
      transform: 'scale(0)'
    }
  },

  '@media screen and (min-width: 1000px)': {
    '.parent': {
      backgroundColor: 'red'
    }
  },

  '@media print': {
    'html, body': {
      color: '#777'
    },

    '@media (min-width: 1000px)': {
      '.parent': {
        border: '1px solid #000'
      }
    }
  },

  '@page :first': {
    'size': 'Letter landscape'
  },

  '@font-face': {
    fontFamily: 'TestWebFont',
    src: 'url(\'webfont.eot?#iefix\') format(\'embedded-opentype\'), url(\'webfont.woff2\') format(\'woff2\'), ' +
      'url(\'webfont.woff\') format(\'woff\'), url(\'webfont.ttf\') format(\'truetype\'), ' +
      'url(\'webfont.svg#svgFontName\') format(\'svg\')'
  }
};

jile('universal-styles', GLOBAL_STYLES, false);

const styles = jile(SCOPED_STYLES);

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className={styles.parent}>
          I am the parent

          <div className={styles.child}>
            I am the child that is bigger than the parent?
          </div>

          <div className={styles.crazyAnimation}>
            I am crazy animated stuffz. Look at me! Wooooo...
          </div>
        </div>
      </div>
    );
  }
}

const div = document.createElement('div');

div.id = 'app-container';

document.body.appendChild(div);

render ((
  <App/>
), div);