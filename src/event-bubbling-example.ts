// @ts-expect-error
import { UI } from "@peasy-lib/peasy-ui";

class DeleteItemEvent extends CustomEvent<Item> {
	declare detail: Item;

	constructor(item: Item) {
		super("delete-item", { detail: item, bubbles: true, composed: true });
	}
}

class Item {
	name: string;
	toggled: boolean;
	template = `
	<div>
		Name: \${name} (\${toggled})
		<button \${ click @=> toggle }>Toggle</button>
		<button \${ click @=> delete }>Delete</button>
	</div>`;

	constructor(name: string, toggled = false) {
		this.name = name;
		this.toggled = toggled;
	}
	toggle = () => this.toggled = !this.toggled;
	delete = (_e: unknown, _m: unknown, el: HTMLElement) => el.dispatchEvent(new DeleteItemEvent(this));
}

class App {
	value = '';
	list: Item[] = [];
	add = () => {
		this.list.push(new Item(this.value));
		this.value = '';
	};
	delete = (e: DeleteItemEvent) => this.list = this.list.filter(item => item !== e.detail);

	static template = `<div \${ delete-item @=> delete }>
      <div><input \${ value <=> value }> <button \${ click @=> add }>Add</button></div>
      <\${ item === } \${ item <=* list}/>
    </div>`;
}
const app = new App();

UI.create(document.body, app, App.template);
