import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef(({children, buttonLabel}, ref) => {
    const [visible, setVisible] = useState(false)
    
    const toggleVisibility = () => setVisible(!visible)

    useImperativeHandle(ref, () => {return {toggleVisibility}})

    return (
        visible
        ?
            <div>
                {children}
                <button onClick={toggleVisibility}>close</button>
            </div>
        :
            <button onClick={toggleVisibility}>{buttonLabel}</button>
    )
})

export default Togglable