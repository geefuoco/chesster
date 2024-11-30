/*
 * Reusable Drag and Drop API
 *
 * The default HTML drag and drop API is not visually appealing in how
 * it handles drag and drop. This API is extremely simple, and allows for
 * quickly adding drag and drop functionality to any HTML elements
 */

type None = null | undefined;
type Optional<T> = T | None;
type DragCallback = (el: HTMLElement) => void
type DropCallback = (el: HTMLElement, drop: HTMLElement) => void
type Position = {
    x: number
    y: number
}

type DragOptions = {
    draggableAttribute: string
    dropzoneAttribute: string
    dragMoveCallback: Optional<DragCallback>
    dragStartCallback: Optional<DragCallback>
    dragEndCallback: Optional<DropCallback>
}

let observer: Optional<MutationObserver> = null
let dragElement: Optional<HTMLElement> = null
let dragElementRect: Optional<DOMRect> = null
let dragMoveCallback: Optional<DragCallback> = null
let dragStartCallback: Optional<DragCallback> = null
let dragEndCallback: Optional<DropCallback> = null
let dropzoneAttribute: Optional<string> = null
let draggableAttribute: Optional<string> = null
let startingMousePosition: Optional<Position> = null
let isMouseDown = false
let isDragging = false

function configureDragAndDrop(dragOptions: Partial<DragOptions>) {
    if (dragOptions.dragMoveCallback) {
        dragMoveCallback = dragOptions.dragMoveCallback
    }
    if (dragOptions.dragStartCallback) {
        dragStartCallback = dragOptions.dragStartCallback
    }
    if (dragOptions.dragEndCallback) {
        dragEndCallback = dragOptions.dragEndCallback
    }
    if (dragOptions.dropzoneAttribute) {
        dropzoneAttribute = dragOptions.dropzoneAttribute
    }
    if (dragOptions.draggableAttribute) {
        draggableAttribute = dragOptions.draggableAttribute
    }

    // Select the draggable elements and add the event listeners to each
    const elements = document.querySelectorAll(`[${draggableAttribute}]`)
    if (!elements.length) {
        console.warn(`No elements with '${draggableAttribute}' in the DOM`)
    }
    for (let i = 0; i < elements.length; ++i) {
        const element = elements[i]
        addEventListeners(element as HTMLElement)
    }

    // Add a MutationObserver to the body
    // If any draggable elements get added, we can apply the event listeners
    // to them
    const mutationConfig = {
        childList: true,
        subtree: true,
    }
    observer = new MutationObserver(mutationCallback)
    observer.observe(document.body, mutationConfig)
}

function mutationCallback(
    records: Array<MutationRecord>,
    observer: MutationObserver,
) {
    for (const record of records) {
        for (let i = 0; i < Array.from(record.addedNodes).length; i++) {
            const addedNode = record.addedNodes[i] as HTMLElement
            if (
                addedNode instanceof HTMLElement &&
                addedNode.hasAttribute(draggableAttribute as string)
            ) {
                addEventListeners(addedNode)
            }
        }
    }
}

function addEventListeners(element: HTMLElement) {
    element.addEventListener("mousedown", dragStart)
    element.addEventListener("mouseup", dragEnd)
    element.addEventListener("mousemove", dragMove)
}

function dragStart(event: MouseEvent) {
    isDragging = false
    isMouseDown = true
    event.preventDefault()
    dragElement = event.currentTarget as HTMLElement
    dragElementRect = dragElement.getBoundingClientRect()
    if (dragStartCallback) {
        dragStartCallback(dragElement)
    }
    dragElement.style.width = `${dragElementRect.width}px`
    dragElement.style.height = `${dragElementRect.height}px`
    startingMousePosition = { x: event.clientX, y: event.clientY }
    moveElementToCursor(dragElement, dragElementRect, event)
    dragElement.style.position = "absolute"
}

function dragEnd(event: MouseEvent) {
    isMouseDown = false
    event.preventDefault()
    if (!dragElement) {
        return
    }
    // Get the current element under the cursor
    // Because we are moving the drag element everywhere,
    // we need to first hide it to get the element underneath
    dragElement.style.display = "none"
    const elUnderCursor = document.elementFromPoint(
        event.clientX,
        event.clientY,
    )
    dragElement.style.display = "visible"
    if (elUnderCursor) {
        const dropzoneElement: HTMLElement | null = elUnderCursor.closest(
            `[${dropzoneAttribute}]`,
        )
        if (dropzoneElement) {
            dropzoneElement.appendChild(dragElement)
            if (dragEndCallback) {
                dragEndCallback(dragElement, dropzoneElement)
            }
        }
    }
    dragElement.style.cssText = ""
    dragElement = null
    dragElementRect = null
    startingMousePosition = null
}

function dragMove(event: MouseEvent) {
    if (dragElement && dragElementRect && isMouseDown) {
        isDragging = true
        moveElementToCursor(
            dragElement as HTMLElement,
            dragElementRect as DOMRect,
            event,
        )
        if (dragMoveCallback) {
            dragMoveCallback(dragElement as HTMLElement)
        }
    }
}

function moveElementToCursor(
    element: HTMLElement,
    rect: DOMRect,
    mouseEvent: MouseEvent,
) {
    const x = mouseEvent.clientX - rect.width / 2
    const y = mouseEvent.clientY - rect.height / 2
    element.style.top = `${y}px`
    element.style.left = `${x}px`
}

export {
    DragCallback,
    DropCallback,
    DragOptions,
    configureDragAndDrop,
    isDragging,
}
