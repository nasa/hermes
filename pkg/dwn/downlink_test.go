package dwn_test

import (
	"bufio"
	"context"
	"crypto/rand"
	"fmt"
	"io"
	"os"
	"slices"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/dwn"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
)

func AssertFileContents(t *testing.T, path string, expectedContents []byte) {
	if !assert.FileExists(t, path, "file does not exist", path) {
		return
	}

	f, err := os.Open(path)
	if !assert.NoError(t, err, "failed to open file", path) {
		return
	}

	defer f.Close()

	r := bufio.NewReader(f)
	contents := make([]byte, 0)
	for {
		chunk := make([]byte, 512)

		n, err := r.Read(chunk)
		contents = slices.Concat(contents, chunk[:n])

		if err == io.EOF {
			break
		}
	}

	assert.EqualValues(t, expectedContents, contents, "file contents don't match expected", path)
}

func ClearFromSlice(s []byte, i, j int) {
	for ; i < j; i++ {
		s[i] = 0
	}
}

type FileValidatorFunc func(r io.Reader) error

func (f FileValidatorFunc) Validate(r io.Reader) error {
	return f(r)
}

func TestCompleteSuccess(t *testing.T) {
	host.Config.DownlinkRoot = t.TempDir()

	fullFile := make([]byte, 1024)
	_, err := rand.Read(fullFile)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	validated := false

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(context.TODO()),
		"test",
		"/root/test.dat",
		"/path/to/desintation_test.dat",
		1024,
		FileValidatorFunc(
			func(r io.Reader) error {
				fullFileValidate := make([]byte, 1024)
				_, err := r.Read(fullFileValidate)
				if err != nil {
					return fmt.Errorf("failed to read file: %w", err)
				}

				if validated = assert.EqualValues(t, fullFile, fullFileValidate); !validated {
					return fmt.Errorf("file contents do not match")
				}

				return nil
			},
		),
	)

	if !assert.NoError(t, err) {
		t.FailNow()
	}

	chunkSizes := []int{128, 256, 12, 54, 129, 68, 56, 321}
	offset := 0
	for _, chunkSize := range chunkSizes {
		session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(offset),
			Data:   fullFile[offset : offset+chunkSize],
		})

		offset += chunkSize
	}

	session.Finish()
	dl := session.Wait()
	assert.True(t, validated)
	assert.FileExists(t, dl.FilePath)
	assert.Equal(t, "/path/to/desintation_test.dat", dl.DestinationPath)
	assert.Equal(t, "/root/test.dat", dl.SourcePath)
	assert.Equal(t, pb.FileDownlinkCompletionStatus_DOWNLINK_COMPLETED, dl.Status)
	AssertFileContents(t, dl.FilePath, fullFile)
}

func TestMissingChunkMiddle(t *testing.T) {
	host.Config.DownlinkRoot = t.TempDir()

	fullFile := make([]byte, 1024)
	_, err := rand.Read(fullFile)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	validated := false

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(context.TODO()),
		"test",
		"/root/test.dat",
		"/path/to/desintation_test.dat",
		1024,
		FileValidatorFunc(
			func(r io.Reader) error {
				t.Fatal("Did not expect to reach validation because of missing chunk")
				return nil
			},
		),
	)

	if !assert.NoError(t, err) {
		t.FailNow()
	}

	expectedFile := slices.Clone(fullFile)
	ClearFromSlice(
		expectedFile,
		128+256+12,
		128+256+12+54,
	)

	chunkSizes := []int{128, 256, 12, 54, 129, 68, 56, 321}
	offset := 0
	for i, chunkSize := range chunkSizes {
		if i == 3 {
			offset += chunkSize
			continue
		}

		session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(offset),
			Data:   fullFile[offset : offset+chunkSize],
		})

		offset += chunkSize
	}

	session.Finish()
	dl := session.Wait()
	assert.False(t, validated)

	assert.FileExists(t, dl.FilePath)
	assert.Equal(t, "/path/to/desintation_test.dat", dl.DestinationPath)
	assert.Equal(t, "/root/test.dat", dl.SourcePath)
	assert.Equal(t, pb.FileDownlinkCompletionStatus_DOWNLINK_PARTIAL, dl.Status)
	assert.Len(t, dl.MissingChunks, 1)
	assert.EqualValues(t, dl.MissingChunks[0].Size, 54)
	assert.EqualValues(t, dl.MissingChunks[0].Offset, 128+256+12)
	AssertFileContents(t, dl.FilePath, expectedFile)
}

func TestMissingChunkEnd(t *testing.T) {
	host.Config.DownlinkRoot = t.TempDir()

	fullFile := make([]byte, 1024)
	_, err := rand.Read(fullFile)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	validated := false

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(context.TODO()),
		"test",
		"/root/test.dat",
		"/path/to/desintation_test.dat",
		1024,
		FileValidatorFunc(
			func(r io.Reader) error {
				t.Fatal("Did not expect to reach validation because of missing chunk")
				return nil
			},
		),
	)

	if !assert.NoError(t, err) {
		t.FailNow()
	}

	expectedFile := slices.Clone(fullFile)
	ClearFromSlice(
		expectedFile,
		1024-321,
		1024,
	)

	chunkSizes := []int{128, 256, 12, 54, 129, 68, 56, 321}
	offset := 0
	for i, chunkSize := range chunkSizes {
		if i == len(chunkSizes)-1 {
			offset += chunkSize
			continue
		}

		session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(offset),
			Data:   fullFile[offset : offset+chunkSize],
		})

		offset += chunkSize
	}

	session.Finish()
	dl := session.Wait()
	assert.False(t, validated)

	assert.FileExists(t, dl.FilePath)
	assert.Equal(t, dl.DestinationPath, "/path/to/desintation_test.dat")
	assert.Equal(t, dl.SourcePath, "/root/test.dat")
	assert.Equal(t, dl.Status, pb.FileDownlinkCompletionStatus_DOWNLINK_PARTIAL)
	assert.Len(t, dl.MissingChunks, 1)
	assert.EqualValues(t, dl.MissingChunks[0].Size, 321)
	assert.EqualValues(t, dl.MissingChunks[0].Offset, 1024-321)
	AssertFileContents(t, dl.FilePath, expectedFile)
}

func TestCompleteDoubleSend(t *testing.T) {
	host.Config.DownlinkRoot = t.TempDir()

	fullFile := make([]byte, 1024)
	_, err := rand.Read(fullFile)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	validated := false

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(context.TODO()),
		"test",
		"/root/test.dat",
		"/path/to/desintation_test.dat",
		1024,
		FileValidatorFunc(
			func(r io.Reader) error {
				fullFileValidate := make([]byte, 1024)
				_, err := r.Read(fullFileValidate)
				if err != nil {
					return fmt.Errorf("failed to read file: %w", err)
				}

				if validated = assert.EqualValues(t, fullFile, fullFileValidate); !validated {
					return fmt.Errorf("file contents do not match")
				}

				return nil
			},
		),
	)

	if !assert.NoError(t, err) {
		t.FailNow()
	}

	chunkSizes := []int{128, 256, 12, 54, 129, 68, 56, 321}
	offset := 0
	for i, chunkSize := range chunkSizes {
		session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(offset),
			Data:   fullFile[offset : offset+chunkSize],
		})

		// Double send a chunk
		if i == 1 {
			session.Chunk(&dwn.DownlinkChunk{
				Offset: uint64(offset),
				Data:   fullFile[offset : offset+chunkSize],
			})
		}

		offset += chunkSize
	}

	session.Finish()
	dl := session.Wait()
	assert.True(t, validated)
	assert.FileExists(t, dl.FilePath)
	assert.Equal(t, "/path/to/desintation_test.dat", dl.DestinationPath)
	assert.Equal(t, "/root/test.dat", dl.SourcePath)
	assert.Equal(t, pb.FileDownlinkCompletionStatus_DOWNLINK_COMPLETED, dl.Status)
	AssertFileContents(t, dl.FilePath, fullFile)
}

func TestBadCRC(t *testing.T) {
	host.Config.DownlinkRoot = t.TempDir()

	fullFile := make([]byte, 1024)
	_, err := rand.Read(fullFile)
	if !assert.NoError(t, err) {
		t.FailNow()
	}

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(context.TODO()),
		"test",
		"/root/test.dat",
		"/path/to/desintation_test.dat",
		1024,
		FileValidatorFunc(
			func(r io.Reader) error {
				return fmt.Errorf("crc32 does not match")
			},
		),
	)

	if !assert.NoError(t, err) {
		t.FailNow()
	}

	chunkSizes := []int{128, 256, 12, 54, 129, 68, 56, 321}
	offset := 0
	for i, chunkSize := range chunkSizes {
		session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(offset),
			Data:   fullFile[offset : offset+chunkSize],
		})

		// Double send a chunk
		if i == 1 {
			session.Chunk(&dwn.DownlinkChunk{
				Offset: uint64(offset),
				Data:   fullFile[offset : offset+chunkSize],
			})
		}

		offset += chunkSize
	}

	session.Finish()
	dl := session.Wait()
	assert.FileExists(t, dl.FilePath)
	assert.Equal(t, "/path/to/desintation_test.dat", dl.DestinationPath)
	assert.Equal(t, "/root/test.dat", dl.SourcePath)
	assert.Equal(t, pb.FileDownlinkCompletionStatus_DOWNLINK_CRC_FAILED, dl.Status)
}
