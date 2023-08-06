// @ts-expect-error
import { UI } from "@peasy-lib/peasy-ui";
import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

type Nullable<T> = T | null | undefined;

const APP_TEMPLATE = `
  <div id="app">
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript + PeasyUI</h1>
    <p class="read-the-docs">
		Click on the Vite and TypeScript logos to learn more
    </p>
    <div class="card">
      <button id="counter" type="button" \${ click @=> inc }>Count: \${ count }</button>
    </div>
		`
	+ "<\${ click @=> secInc } \${ second === }/>"
	// + "<\${ list === }/>"
	+ `
  </div>
`;
const Second = () => ({
	count: 69,
	name: "Second",
	template: `<p>\${ name } count is \${ count }</p>`,
});
class SecondListModel extends Array<ReturnType<typeof Second>> {
	declare clicked_item: (...args: any[]) => any;
	template = `<div class="card" \${ item <=* this }>` +
		(false ? "<button ${ click @=> clicked_item }></button>" : "") +
		`<\${ item === }/></div>`;

	get list() {
		return this as Array<ReturnType<typeof Second>>;
	}
}
class App {
	count: number;
	list: SecondListModel;
	second: ReturnType<typeof Second>;
	constructor() {
		this.count = 0;
		this.second = Second();
		this.list = new SecondListModel();
		this.list.clicked_item = this.clicked_item;
		const s = Second();
		s.count = 1;
		s.name = "One";
		this.list.push(s);
	}

	inc = () => {
		this.count += 1;
	};
	secInc() {
		this.second.count += 1;
	}
	clicked_item = (_event: Nullable<PointerEvent>, $model: any) => {
		console.log(this);
		$model.item.count += 1;
		const i = this.list.length + 1;
		if (i > 5) {
			for (let x = 0; x < this.list.length; ++x) {
				this.list[x].count += 1;
			}
			return;
		}
		const s = Second();
		if (i == 2) {
			s.name = "Second";
		} else if (i == 3) {
			s.name = "Third";
		} else {
			s.name = `${i}`;
		}
		s.count = i;
		this.list.push(s);
	};
};
const app = new App();

for (let x = 0; x < 4; x++) {
	const i = app.list.length + 1;
	const s = Second();
	if (i == 2) {
		s.name = "Second";
	} else if (i == 3) {
		s.name = "Third";
	} else {
		s.name = `${i}`;
	}
	s.count = i;
	app.list.push(s);
}

UI.create(document.body, app, APP_TEMPLATE);
