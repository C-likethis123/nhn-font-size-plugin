/**
 * @fileoverview Code for the font size plugin
 * @author Chow Jia Ying <chowjiaying211@gmail.com>
 *
 * This is a plugin to adjust the font size of a block of text.
 * The plugin introduces an input element for users to enter their desired font size.
 * When the user enters a numeric value, it should change the font size of the highlighted text.
 *
 * Additionally, there can be a dropdown list/menu list for users to click onto. When clicked, a list of common font sizes will be displayed (will be taken from Microsoft word).
 *
 * There should be validation, where only numbers are allowed values.
 */

/**
 * Renders the font dropdown options
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * Renders a dropdown of font sizes. On click, it updates the font size and closes the dropdown.
 * It also has an input field. When updated, it also updates the font size.
 * Create a dropdown using select and option elements. The value will be used to update the input. When the input is updated, it also changes the dropdown elements. If the dropdown does not have that input, it does not select any of the dropdowns.
 */
function initDropdown(editor) {
  const dropdownContainer = document.createElement("div")
  const dropdown = document.createElement("ul")

  dropdown.setAttribute(
    "style",
    "padding-inline-start: 0px; margin-block-start: 0px; margin-block-end:0px;"
  )
  const fontSizeValues = [12, 14, 16, 18, 20, 24]

  fontSizeValues.forEach((fontSize) => {
    const option = document.createElement("li")

    option.setAttribute("style", "list-style: none;")

    option.textContent = fontSize
    option.value = fontSize
    option.addEventListener("click", (event) => {
      const fontSizeValue = event.target.value

      editor.exec("changeFontSize", fontSizeValue)
    })
    dropdown.appendChild(option)
  })
  dropdownContainer.appendChild(dropdown)
  const popup = editor.getUI().createPopup({
    header: false,
    title: null,
    content: dropdownContainer,
    className: "fontDropdownContainer",
    target: editor.getUI().getToolbar().el,
    css: {
      width: "auto",
      position: "absolute",
      right: "840px"
    }
  })

  editor.eventManager.listen("showDropdown", () => {
    popup.show()
  })
}
/**
 * Renders the UI of the editor
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
function initUI(editor) {
  const toolbar = editor.getUI().getToolbar()
  const fontSizeInput = document.createElement("input")

  editor.eventManager.addEventType("showDropdown")

  toolbar.insertItem(-1, {
    type: "divider"
  })

  toolbar.insertItem(-2, {
    type: "button",
    options: {
      name: "fontSizePlugin",
      className: "tui-fontSize",
      event: "showDropdown",
      tooltip: "Font Size",
      el: fontSizeInput,
      style:
        "width: 40px; margin: 5px 3px; line-height: 12px; font-size: 11px; min-height: 14px;"
    }
  })
  fontSizeInput.setAttribute("type", "number")
  fontSizeInput.setAttribute("value", "12")
  fontSizeInput.addEventListener("change", (event) => {
    const fontSize = parseInt(event.target.value, 10)

    if (isNaN(fontSize) || fontSize <= 0) {
      return
    }
    editor.exec("changeFontSize", fontSize)
  })
  initDropdown(editor)
}

/**
 * Font size plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */

export default function fontSizePlugin(editor) {
  editor.addCommand("wysiwyg", {
    name: "changeFontSize",
    exec(wwe, fontSize) {
      const sq = wwe.getEditor()

      sq.setFontSize(`${fontSize}px`)
    }
  })
  initUI(editor)
}
