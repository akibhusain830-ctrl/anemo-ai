import { NextResponse } from 'next/server'

// Temporary in-memory storage for demo purposes
// In a real app, this would be replaced with a proper database
// eslint-disable-next-line prefer-const
let documents = [
  {
    id: '1',
    title: 'Getting Started Guide',
    content: 'Welcome to our comprehensive getting started guide. This document will walk you through the initial setup process and help you understand the core features of our platform. We will cover account creation, basic navigation, and initial configuration steps.',
    fileSize: 2048,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    title: 'API Documentation',
    content: 'This is the complete API documentation for our platform. It includes endpoint descriptions, request/response formats, authentication methods, rate limiting information, and code examples in multiple programming languages. Each endpoint is thoroughly documented with parameters, return values, and error codes.',
    fileSize: 8192,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString()
  },
  {
    id: '3',
    title: 'User Manual',
    content: 'The comprehensive user manual covers all aspects of using the platform. From basic operations to advanced features, this manual serves as your complete reference guide. It includes step-by-step tutorials, troubleshooting tips, best practices, and frequently asked questions.',
    fileSize: 4096,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString()
  }
]

export async function GET() {
  try {
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, fileSize } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const newDocument = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      title,
      content,
      fileSize: fileSize || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    documents.push(newDocument)

    return NextResponse.json({ 
      document: newDocument,
      message: 'Document created successfully' 
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const documentIndex = documents.findIndex(doc => doc.id === id)

    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const deletedDocument = documents[documentIndex]
    documents.splice(documentIndex, 1)

    return NextResponse.json({ 
      message: 'Document deleted successfully',
      document: deletedDocument
    })
  } catch (error) {
    console.error('Failed to delete document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, content, fileSize } = body

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'ID, title, and content are required' },
        { status: 400 }
      )
    }

    const documentIndex = documents.findIndex(doc => doc.id === id)

    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    documents[documentIndex] = {
      ...documents[documentIndex],
      title,
      content,
      fileSize: fileSize || documents[documentIndex].fileSize,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      document: documents[documentIndex],
      message: 'Document updated successfully' 
    })
  } catch (error) {
    console.error('Failed to update document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}