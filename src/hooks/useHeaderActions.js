/**
 * Hook personalizado para manejar las acciones del header relacionadas con filtros y búsqueda.
 * @param {function} setSelectedCategory - Función para setear la categoría seleccionada.
 * @param {function} setHeaderFilter - Función para setear los filtros del header.
 * @param {function} setSearchTerm - Función para setear el término de búsqueda.
 * @param {function} navigate - Función de navegación de React Router.
 * @param {string} pathname - La ruta actual.
 * @returns {object} Objeto con las funciones handleFilterByCategory y handleHeaderSearchSubmit.
 */
const useHeaderActions = (setSelectedCategory, setHeaderFilter, setSearchTerm, navigate, pathname) => {
  const handleFilterByCategory = (category, type = null) => {
    setSelectedCategory(category || null);
    if (type) {
      setHeaderFilter(prev => ({
        ...prev,
        type: prev.type === type ? null : type
      }));
    }
  }

  const handleHeaderSearchSubmit = (term) => {
    setSearchTerm(term)
    setSelectedCategory(null)
    if (term.trim().length > 0 && pathname !== '/productos') {
      navigate('/productos')
    }
  }

  return {
    handleFilterByCategory,
    handleHeaderSearchSubmit
  }
}

export default useHeaderActions