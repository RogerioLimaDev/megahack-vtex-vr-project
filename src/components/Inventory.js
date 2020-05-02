AFRAME.registerComponent('inventory', {
  init: function () {
    var componentReference = this

    for (var i = 0; i < 10; i++) {
      addChildElement(this.el, 'a-plane', {
        color: 'black',
        transparent: 'true',
        opacity: '0.6',
        position: [-0.44 + i * 0.0977, 0.015, 0.02],
        width: '0.08',
        height: '0.08'
      })
    }

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return

      var isNumberKey =
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)

      if (isNumberKey) componentReference.selectSlot(Number(e.key))
    })

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
      if (e.keyCode === 82) {
        removeProductFromChart(componentReference.selectedSlot - 1)
        componentReference.updateInventory()
      }
    })

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
      if (e.keyCode === 107) componentReference.changeQuantity(true)
    })

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
      if (e.keyCode === 109) componentReference.changeQuantity(false)
    })

    this.selectSlot(1)
    this.updateInventory()
  },
  updateInventory: function () {
    var chart = localStorage.getItem('CHART')
    chart = chart ? JSON.parse(chart) : []

    var inventorySlots = document.querySelectorAll('#inventory a-plane')

    inventorySlots.forEach(function (inventorySlot, index) {
      var product = chart[index]

      if (inventorySlot.firstChild) {
        inventorySlot.firstChild.remove()
      }

      if (product) {
        var inventorySlotContent = addChildElement(inventorySlot, 'a-entity')

        addChildElement(inventorySlotContent, 'a-entity', {
          scale: '0.0006 0.0006 0.0006',
          rotation: '0 90 0',
          position: '0.007 0 0.02',
          'gltf-model': product['gltf-model']
        })

        var quantityContainer = addChildElement(
          inventorySlotContent,
          'a-circle',
          {
            width: '0.001',
            height: '0.001',
            scale: '0.015 0.015 0.015',
            position: '0.007 0.06 0.02',
            color: 'white'
          }
        )

        addChildElement(quantityContainer, 'a-text', {
          value: product.quantity,
          color: '#7300e6',
          width: '6',
          'wrap-count': '10',
          position: product.quantity > 9 ? '-0.65 0 0' : '-0.4 0 0'
        })
      }
    })
  },
  selectSlot(slotIndex) {
    if (slotIndex) {
      this.selectedSlot = slotIndex
      var inventorySlots = document.querySelectorAll('#inventory a-plane')

      inventorySlots.forEach(function (inventorySlot) {
        inventorySlot.setAttribute('color', 'black')
      })

      var inventorySlot = inventorySlots[slotIndex - 1]
      inventorySlot.setAttribute('color', '#7300e6')
    }
  },
  changeQuantity: function (isToIncrement) {
    var inventorySlots = document.querySelectorAll('#inventory a-plane')
    var chart = localStorage.getItem('CHART')
    chart = chart ? JSON.parse(chart) : []
    var chartIndex = this.selectedSlot - 1

    var selectedProduct = chart[chartIndex]
    var inventorySlot = inventorySlots[chartIndex]

    if (
      selectedProduct &&
      inventorySlot &&
      ((isToIncrement && selectedProduct.quantity < 99) ||
        (!isToIncrement && selectedProduct.quantity > 1))
    ) {
      if (isToIncrement) selectedProduct.quantity = selectedProduct.quantity + 1
      else selectedProduct.quantity = selectedProduct.quantity - 1

      var quantityTextElement = inventorySlot.querySelector('a-text')
      quantityTextElement.setAttribute('value', selectedProduct.quantity)
      quantityTextElement.setAttribute(
        'position',
        selectedProduct.quantity > 9 ? '-0.65 0 0' : '-0.4 0 0'
      )

      chart[chartIndex] = selectedProduct
    }

    localStorage.setItem('CHART', JSON.stringify(chart))
  }
})