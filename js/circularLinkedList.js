/**
 * Limited circular linked list. Right now, this is all we need.
 */
function CircularLinkedList() {
    let Node = function(value) {
        this.prev = null;
        this.value = value;
        this.next = null;
    };

    let length = 0;
    let head = null;
    let tail = null;

    this.findNodeByValue = function(search) {
        if (length === 0) {
            return undefined;
        }

        let node = head;
        for (let i = 0; i < length; i++) {
            if (node.value === search) {
                return node;
            }
            else {
                node = node.next;
            }
        }
    };

    this.append = function(value) {
        let node = new Node(value);

        if (!head) {
            head = node;
            tail = node;
        }
        else {
            node.prev = tail;
            tail.next = node;
            tail = node;
        }

        head.prev = tail;
        tail.next = head;
        length++;

        return node;
    };

    this.getHead = function() {
        return head;
    };
}

export { CircularLinkedList };
