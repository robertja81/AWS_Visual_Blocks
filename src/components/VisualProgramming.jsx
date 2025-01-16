import React, { useState } from 'react';
import { Database, List, Trash2, Play } from 'lucide-react';

const Block = ({ type, onConnect, isConnected, onClick }) => {
  const getBlockStyle = () => {
    const baseStyle = "p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 flex items-center gap-3";
    switch (type) {
      case 'session':
        return `${baseStyle} bg-blue-500 text-white`;
      case 'createBucket':
        return `${baseStyle} ${isConnected ? 'bg-green-500' : 'bg-gray-300'} text-white`;
      case 'listBuckets':
        return `${baseStyle} ${isConnected ? 'bg-green-500' : 'bg-gray-300'} text-white`;
      case 'deleteBucket':
        return `${baseStyle} ${isConnected ? 'bg-green-500' : 'bg-gray-300'} text-white`;
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'session':
        return <Database className="w-6 h-6" />;
      case 'createBucket':
        return <Play className="w-6 h-6" />;
      case 'listBuckets':
        return <List className="w-6 h-6" />;
      case 'deleteBucket':
        return <Trash2 className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'session':
        return 'AWS Session';
      case 'createBucket':
        return 'Create S3 Bucket';
      case 'listBuckets':
        return 'List S3 Buckets';
      case 'deleteBucket':
        return 'Delete S3 Bucket';
      default:
        return '';
    }
  };

  return (
    <div 
      className={getBlockStyle()}
      onClick={() => onClick(type)}
    >
      {getIcon()}
      <span>{getLabel()}</span>
      {type !== 'session' && (
        <div className="ml-auto">
          {isConnected ? (
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-red-300"></div>
          )}
        </div>
      )}
    </div>
  );
};

const VisualProgramming = () => {
  const [connectedBlocks, setConnectedBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [code, setCode] = useState('');

  const handleBlockClick = (type) => {
    if (type === 'session') {
      setConnectedBlocks(['session']);
      setSelectedBlock('session');
      generateCode(['session']);
    } else if (connectedBlocks.includes('session')) {
      const newBlocks = [...connectedBlocks];
      if (!newBlocks.includes(type)) {
        newBlocks.push(type);
        setConnectedBlocks(newBlocks);
        setSelectedBlock(type);
        generateCode(newBlocks);
      }
    }
  };

  const generateCode = (blocks) => {
    let generatedCode = 'import boto3\n\n';
    generatedCode += '# Initialize session\n';
    generatedCode += 'session = boto3.Session()\n';
    generatedCode += 's3_client = session.client("s3")\n\n';

    blocks.forEach(block => {
      if (block === 'createBucket') {
        generatedCode += '# Create bucket\n';
        generatedCode += 'bucket_name = "your-bucket-name"\n';
        generatedCode += 'response = s3_client.create_bucket(\n';
        generatedCode += '    Bucket=bucket_name,\n';
        generatedCode += '    CreateBucketConfiguration={"LocationConstraint": "us-west-2"}\n';
        generatedCode += ')\n\n';
      } else if (block === 'listBuckets') {
        generatedCode += '# List buckets\n';
        generatedCode += 'response = s3_client.list_buckets()\n';
        generatedCode += 'buckets = [bucket["Name"] for bucket in response["Buckets"]]\n';
        generatedCode += 'print("Buckets:", buckets)\n\n';
      } else if (block === 'deleteBucket') {
        generatedCode += '# Delete bucket\n';
        generatedCode += 'bucket_name = "your-bucket-name"\n';
        generatedCode += 'response = s3_client.delete_bucket(\n';
        generatedCode += '    Bucket=bucket_name\n';
        generatedCode += ')\n\n';
      }
    });

    setCode(generatedCode);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">AWS Visual Programming - By Robert Anderson</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Block 
          type="session" 
          onClick={handleBlockClick}
          isConnected={connectedBlocks.includes('session')}
        />
        <Block 
          type="createBucket" 
          onClick={handleBlockClick}
          isConnected={connectedBlocks.includes('createBucket')}
        />
        <Block 
          type="listBuckets" 
          onClick={handleBlockClick}
          isConnected={connectedBlocks.includes('listBuckets')}
        />
        <Block 
          type="deleteBucket" 
          onClick={handleBlockClick}
          isConnected={connectedBlocks.includes('deleteBucket')}
        />
      </div>

      {code && (
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VisualProgramming;
