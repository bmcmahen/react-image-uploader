import React, { Component } from 'react';
import ImageUploader from 'react-image-uploader';

function uploadImage(file, fn) {
  console.log('upload file', file)
  setTimeout(() => {
    fn(new Error('doh!'))
  }, 1000)
}

export default class App extends Component {
  render() {
    return (
      <ImageUploader
        onUpload={uploadImage}
        onRender={(props, state, ctx) => {

          var buttonStyle = {
            fontFamily: 'Helvetica neue, helvetica, arial, sans-serif',
            border: '2px solid white',
            fontSize: '14px',
            color: 'white',
            padding: '5px 10px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '4px',
            position: 'absolute',
            top: '10px',
            right: '10px'
          }

          if (props.image) {
            let style = {
              backgroundImage: `url(${props.image})`,
              backgroundSize: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 1,
              transition: 'all 0.3s ease-out'
            }

            if (props.error) {
              style.opacity = 0.3
            }

            let wrapperStyle = {
              position: 'relative',
              marginRight: '20px',
              width: '200px',
              height: '250px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }


            return (
              <div style={wrapperStyle}>
                <div style={style} />
                <button style={buttonStyle} onClick={props.onRequestRemove}>
                  Remove
                </button>
                {props.error && <div>
                  <i style={{color: 'red', fontSize: '1.5em'}} className='ion-android-alert' />
                  <div style={{fontFamily: 'helvetica neue', color: 'red'}}>An error occurred</div>
                </div>}
              </div>
            )
          }

          let style = {
            width: '200px',
            height: '250px',
            borderWidth: '2px',
            borderStyle: 'solid',
            marginRight: '20px',
            borderColor: 'black',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
          }

          let iconStyle = {
            color: 'black',
            fontSize: '4em'
          }

          if (state.onDragOver) {
            style.borderColor = 'black'
          }

          buttonStyle.color = 'black'
          buttonStyle.border = '2px solid black'
          buttonStyle.position = 'static'
          buttonStyle.background = 'none'

          return (
            <div style={style}>
              <div style={{marginBottom: '10px'}}>
                <i style={iconStyle} className='ion-ios-photos-outline' />
              </div>
              <div>
                <button style={buttonStyle} onClick={props.onUploadPrompt}>
                  Add Photo
                </button>
              </div>
            </div>
          )
        }}
      />
    );
  }
}
