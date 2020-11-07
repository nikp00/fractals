const canvas = document.querySelector("canvas");
const generateButton = document.querySelector(".generate-tree-button");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let isSpacePressed = false;


let props = {
	startX: 0,
	startY: 0,
	len: Math.floor(canvas.height / 5),
	angle: 0,
	branchWidth: 0,
	color1: 0,
	color2: 0,
	spreed: 0,
	branchShrinkFactor: 0.6,
	leavesAngle: 90,
	leavesWidth: 10,
	heightShrinkFactor: 0.75
}

const drawTree = (startX, startY, len, angle, branchWidth) => {
	const {
		color1,
		color2,
		spreed,
		branchShrinkFactor,
		leavesAngle,
		leavesWidth,
		heightShrinkFactor
	} = props;

	ctx.beginPath();
	ctx.save();
	ctx.strokeStyle = color1;
	ctx.fillStyle = color2;
	ctx.lineWidth = branchWidth;
	ctx.translate(startX, startY);
	ctx.rotate((angle * Math.PI) / 180);
	ctx.moveTo(0, 0);

	if (angle > 0) {
		ctx.bezierCurveTo(20, -len / 2, 20, -len / 2, 0, -len)
	} else if (angle < 0) {
		ctx.bezierCurveTo(-20, -len / 2, -20, -len / 2, 0, -len)
	} else {
		ctx.lineTo(0, -len);
	}
	// ctx.lineTo(0, -len);
	ctx.stroke();

	if (len < 10) {
		ctx.beginPath();
		ctx.arc(0, -len, leavesWidth, 0, (Math.PI / 180) * leavesAngle);
		ctx.fill();

		ctx.restore();
		return;
	}

	curve = 5; //(Math.random() * 10) + 10

	drawTree(0, -len, len * heightShrinkFactor, angle + spreed, branchWidth * branchShrinkFactor);
	drawTree(0, -len, len * heightShrinkFactor, angle - spreed, branchWidth * branchShrinkFactor);

	ctx.restore();
};

const scale = (num, in_min, in_max, out_min, out_max) => {
	return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};


const main = () => {
	generateButton.addEventListener("click", generateRandomTree);
	canvas.addEventListener("mousemove", (evt) => {
		if (isSpacePressed) {
			let rect = canvas.getBoundingClientRect();
			let x = evt.clientX - rect.left;
			let y = evt.clientY - rect.top;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			props.angle = scale(x, 0, canvas.width, -10, 10);
			props.spreed = scale(y, 0, canvas.height, 5, 30);
		}
	});

	canvas.addEventListener("mousedown", (evt) => {
		isSpacePressed = true;
	});

	canvas.addEventListener("mouseup", (evt) => {
		isSpacePressed = false;
	})


	generateRandomTree();
}
const generateRandomTree = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	props.startX = canvas.width / 2;
	props.startY = canvas.height - 80;
	// props.len = Math.floor(canvas.height / 5);
	props.angle = 5;
	props.spreed = 15;
	props.branchWidth = Math.random() * 80 + 1;
	props.color1 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
	props.color2 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
	updateTree();

	generateButton.style.background = props.color1;
	gui.updateDisplay();
}

const updateTree = () => {
	drawTree(props.startX,
		props.startY,
		props.len,
		props.angle,
		props.branchWidth,
	);
}

const update = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateTree();
	requestAnimationFrame(update);
}

let gui = new dat.GUI({
	name: "My GUI",
});

gui.add(props, "len", canvas.height / 10, canvas.height / 3);
gui.add(props, "branchWidth", 5, 100);
gui.add(props, "branchShrinkFactor", 0.2, 0.6);
gui.add(props, "leavesAngle", 45, 125);
gui.add(props, "leavesWidth", 5, 15);
gui.add(props, "heightShrinkFactor", 0.65, .75);





main();
requestAnimationFrame(update);