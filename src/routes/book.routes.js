const express = require('express')
const router = express.Router()
const Book = require('../models/books')

// middleware
const getBook = async (req,res,next) => {
    let book;
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}/)){
        return res.status(404).json(
            {message:'El ID solicitado NO es válido.'}
        )
    }

    try {
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json(
                {message:'El libro no fue encontrado.'}
            )
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }

    res.book = book;
    next();
}

// fin de midleware

// obtener todos los libros
router.get('/', async (req,res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if(books.length === 0){
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
//fin obtener todos los libros

// crear nuevo libro recurso POST
router.post('/', async (req,res) => {
    const {title,author,genre,publication_date} = req?.body

    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({
            message:'los campos título, autor, género y fecha de publicación son obligatorios !!'
        })
    }

    const book = new Book (
        {
            title,
            author,
            genre,
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})
// fin crear nuevo libro recurso POST

// buscador GET:id
router.get('/:id', getBook, async(req,res) =>{
    res.json(res.book);
})

// fin buscador

// modificar PUT
router.put('/:id', getBook, async (req,res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
            res.json(updateBook)
    }catch(error){
        res.status(400).json({message:error.message})
    }
})
// fin modificar PUT

// modificar PATCH
router.patch('/:id', getBook, async (req,res) => {
    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({message:'Al menos uno de estos campos debe ser enviado: título, autor, género o fecha de publicación'})
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
            res.json(updateBook)
    }catch(error){
        res.status(400).json({message:error.message})
    }
})
// fin modificar PATCH

// borrar
router.delete('/:id', getBook, async (req,res) => {
    try {
        const book = res.book        
        await book.deleteOne(
            {_id: book._id}
        );
        res.json({message:`El libro " ${book.title} " fue eliminado con éxito !!`})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
// fin borrar




// exportar
module.exports = router



