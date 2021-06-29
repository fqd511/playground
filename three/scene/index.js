import * as THREE from 'https://cdn.skypack.dev/three@0.129.0'

function main() {
	console.log('into main');

	/** canvas dom */
	const canvasDom = document.querySelector('#canvas')

	const renderer = new THREE.WebGLRenderer({
		canvas: canvasDom
	})
	renderer.setClearColor(0xAAAAAA)
	renderer.shadowMap.enabled = true

}

main()