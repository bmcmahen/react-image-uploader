import React, {PropTypes} from 'react'

export default class DropZone extends React.Component {

  static propTypes = {
    image: PropTypes.string,
    error: PropTypes.any,
    alt: PropTypes.string,
    onDrop: PropTypes.func.isRequired,
    onRequestRemove: PropTypes.func,
    onUploadPrompt: PropTypes.func.isRequired
  }

  state = {
    onDragOver: false
  }

  render() {
    const {alt, image, onUploadPrompt, onRender} = this.props
    const {onDragOver} = this.state

    // allow the user to render their own elements
    if (onRender) {
      let el = onRender(this.props, this.state, this)
      if (image) return el
      return React.cloneElement(el, {
        onDragEnter: this.onDragEnter.bind(this),
        onDragOver: this.onDragOver.bind(this),
        onDragLeave: this.onDragLeave.bind(this),
        onDrop: this.props.onDrop
      })
    }

    if (image) {
      let styles = {
        width: '230px',
        height: '250px',
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`
      }

      return (
        <div
          role='image'
          style={styles}
          aria-label={alt}
        />
      )
    }


    let styles = {
      width: '230px',
      height: '250px',
      border: '1px solid #ddd'
    }

    if (onDragOver) {
      styles.borderColor = '#08c'
    }

    return (
      <div
        onDragEnter={::this.onDragEnter}
        onDragOver={::this.onDragOver}
        onDragLeave={::this.onDragLeave}
        onDrop={::this.onDrop}
        style={styles}>
          <button onClick={onUploadPrompt}>
            Add Photo
          </button>
      </div>
    )
  }

  onDragEnter(e) {
    e.preventDefault();
    this.setState({ onDragOver: true });
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragLeave() {
    this.setState({ onDragOver: false });
  }

  onDrop(e) {
    this.setState({ onDragOver: false });
    e.preventDefault();
    this.props.onDrop(e)
  }

}
