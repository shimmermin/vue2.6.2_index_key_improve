function createKeyToNewIdx(newChildren,StartIdx,EndIdx){
	let i,key
	const map={}

	for(i=StartIdx;i<=EndIdx;++i){
		key=newChildren[i].key
		if(isDef(key)) {
			map[key]=i
			}else{
				}
		}
  return map
}


function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
  /*2020.12
    *huxinmin  improved
    *Suggestions are welcome
    */
	let newKeyToIdx
	let endIdxInNew,startIdxInNew
    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }
	
	
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	 
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
		  /**2020.12
       * shimmer improved about key to index.
       */
		  if(isUndef(newKeyToIdx)){
			  newKeyToIdx=createKeyToNewIdx(newCh,newStartIdx,newEndIdx)
		  }
			  
		  if(isDef(oldStartVnode.key)){
			  startIdxInNew=newKeyToIdx[oldStartVnode.key]
		  }else{
			  startIdxInNew=findIdxInNew(oldStartVnode,newCh,newStartIdx,newEndIdx)
		  }
		  
		  if(isUndef(startIdxInNew)){
			  removeVnodes(parentElm, oldCh, oldStartIdx, oldStartIdx)
			  oldStartVnode = oldCh[++oldStartIdx]
		  }else{  
			  if(isDef(oldEndVnode.key)){
				  endIdxInNew=newKeyToIdx[oldEndVnode.key]
			  }else{
				  endIdxInNew=findIdxInNew(oldEndVnode,newCh,newStartIdx,newEndIdx)
			  }
			  
			  if(isUndef(endIdxInNew)){
				  removeVnodes(parentElm, oldCh, oldEndIdx, oldEndIdx)
				  oldEndVnode = oldCh[--oldEndIdx]
			  }else{
				  if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
					idxInOld = isDef(newStartVnode.key)
		
					  ? oldKeyToIdx[newStartVnode.key]
					  : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
				   
				  if (isUndef(idxInOld)) { // New element
					  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
				  } else {
					  vnodeToMove = oldCh[idxInOld]
					  if (sameVnode(vnodeToMove, newStartVnode)) {
						patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
						oldCh[idxInOld] = undefined
						canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
					  } else {
						// same key but different element. treat as new element
						createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
					  }
					}
					newStartVnode = newCh[++newStartIdx]
				 }
		  }	  
    }  
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }



  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }
