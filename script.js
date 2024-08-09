document.addEventListener('DOMContentLoaded', () => {
    const insertTextButton = document.getElementById('insertText');
    const editingArea = document.getElementById('editingArea');
    const fontSelector = document.getElementById('fontSelector');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const fontColorSelector = document.getElementById('fontColorSelector');
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');

    let selectedElement = null;
    let isDragging = false;

    const history = {
        undoStack: [],
        redoStack: []
    };

    const createTextElement = () => {
        const textElement = document.createElement('div');
        textElement.classList.add('text-element');
        textElement.setAttribute('contenteditable', 'true');
        textElement.textContent = 'Enter Your Text';
        textElement.style.fontFamily = fontSelector.value;
        textElement.style.fontSize = fontSizeSelector.value;
        textElement.style.color = fontColorSelector.value;
        textElement.style.left = '50%';
        textElement.style.top = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        editingArea.appendChild(textElement);

        textElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            selectElement(textElement);
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && selectedElement) {
                selectedElement.style.left = `${e.clientX - editingArea.offsetLeft}px`;
                selectedElement.style.top = `${e.clientY - editingArea.offsetTop}px`;
                selectedElement.style.transform = 'none'; 
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (selectedElement) {
                selectedElement.style.transform = 'translate(-50%, -50%)'; 
            }
        });

        selectElement(textElement);
        saveState(); 
    };

    const selectElement = (element) => {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        selectedElement = element;
        selectedElement.classList.add('selected');

        fontSelector.value = selectedElement.style.fontFamily || 'Arial';
        fontSizeSelector.value = selectedElement.style.fontSize || '16px';
        fontColorSelector.value = selectedElement.style.color || '#000000';
    };

    const saveState = () => {
        
        const state = {
            html: editingArea.innerHTML
        };
        history.undoStack.push(state);
        history.redoStack = []; 
    };

    const undo = () => {
        if (history.undoStack.length > 0) {
            const state = history.undoStack.pop();
            history.redoStack.push({
                html: editingArea.innerHTML
            });
            editingArea.innerHTML = state.html;
            
        }
    };

    const redo = () => {
        if (history.redoStack.length > 0) {
            const state = history.redoStack.pop();
            history.undoStack.push({
                html: editingArea.innerHTML
            });
            editingArea.innerHTML = state.html;
            
        }
    };

    
    insertTextButton.addEventListener('click', () => {
        createTextElement();
        saveState(); // Save the state after inserting text
    });

    editingArea.addEventListener('mousedown', (e) => {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
        }
    });

    fontSelector.addEventListener('change', () => {
        if (selectedElement) {
            selectedElement.style.fontFamily = fontSelector.value;
            saveState(); // Save the state after changing font
        }
    });

    fontSizeSelector.addEventListener('change', () => {
        if (selectedElement) {
            selectedElement.style.fontSize = fontSizeSelector.value;
            saveState(); // Save the state after changing font size
        }
    });

    fontColorSelector.addEventListener('input', () => {
        if (selectedElement) {
            selectedElement.style.color = fontColorSelector.value;
            saveState(); // Save the state after changing font color
        }
    });

    undoButton.addEventListener('click', undo);
    redoButton.addEventListener('click', redo);
});
