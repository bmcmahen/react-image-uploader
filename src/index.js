/**
 * Module dependencies
 */

import React, {PropTypes} from 'react'
import DropZone from './DropZone'
import filePicker from 'component-file-picker'
import File from 'component-file'
import uid from 'uid'
import findIndex from 'lodash.findindex'
import remove from 'lodash.remove'

/**
 * Image Uploader
 */

export default class ImageUploader extends React.Component {

  static propTypes = {
    initialPhotos: PropTypes.array.isRequired,
    onUpload: PropTypes.func.isRequired,
    maxPhotos: PropTypes.number,
    accept: PropTypes.string,
    onRender: PropTypes.func
  }

  static defaultProps = {
    initialPhotos: [],
    maxPhotos: 100,
    accept: 'image/*',
    onError: () => {}
  }

  constructor(props) {
    super(props)
    const photos = props.initialPhotos.map(url => {
      return { url, uploaded: true, key: uid() }
    })
    this.state = { photos }
  }

  render() {
    const {photos} = this.state
    const {maxPhotos} = this.props
    const photosCount = photos.length

    return (
      <div className='ImageUploader'>
        <div style={{display: 'flex'}}>
          {photos.map(::this.renderPhoto)}
          {photosCount < maxPhotos && <DropZone
            onDrop={::this.onDrop}
            onRender={this.props.onRender}
            onUploadPrompt={::this.promptFiles} />}
        </div>
      </div>
    )
  }

  addFile(file) {
    const {accept} = this.props
    const image = new File(file)

    if (!image.is(accept)) {
      return this.onUploadImage(new Error('File type not supported'))
    }

    image.toDataURL((err, str) => {
      if (err) {
        return this.onUploadImage(err)
      }

      this.onUploadImage(null, str, file)
    })
  }

  promptFiles(e) {
    e.preventDefault()
    filePicker({ multiple: true }, files => {
      for (let i = 0; i < files.length; i++) {
        this.addFile(files[i])
      }
    })
  }

  getIndexOfPhoto(key) {
    return findIndex(this.state.photos, { key: key })
  }

  removePhoto(id) {
    this.setState(currentState => {
      remove(currentState.photos, { key: id })
      return currentState
    })
  }

  updatePhoto(id, state) {
    this.setState(currentState => {
      currentState.photos[this.getIndexOfPhoto(id)] = state
      return currentState
    })
  }

  mergePhoto(id, state) {
    this.setState(currentState => {
      Object.assign(currentState.photos[this.getIndexOfPhoto(id)], state)
      return currentState
    })
  }

  addPhoto(state) {
    this.setState(currentState => {
      currentState.photos.push(state)
      return currentState
    })
  }

  onUploadImage(error, str, file) {
    const {onUpload} = this.props
    const id = uid()

    // update our initial state
    const initialState = {
      key: id,
      url: str,
      file: file,
      uploaded: false
    }

    if (
      (this.state.photos.length >= this.props.maxPhotos)
    ) {
      return
    }

    if (error) {
      initialState.error = error
      this.addPhoto(initialState)
      return
    }

    this.addPhoto(initialState)
    if (!onUpload) return

    onUpload(
      file,
      (err, url) => {
        if (err) {
          this.mergePhoto(id, {
            error: err
          })
        } else {
          this.updatePhoto(id, {
            error: null,
            url: url,
            uploaded: true
          })
        }
      },
      (progress) => {
        this.mergePhoto(id, { progress })
      }
    )
  }

  onDrop(e) {
    e.preventDefault()
    let files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      this.addFile(files[i])
    }
  }

  renderPhoto(photo) {
    return (
      <DropZone
        key={photo.key}
        image={photo.url}
        error={photo.error}
        onDrop={::this.onDrop}
        onRequestRemove={() => this.removePhoto(photo.key)}
        onUploadPrompt={::this.promptFiles}
        onRender={this.props.onRender}
      />
    )
  }

}
