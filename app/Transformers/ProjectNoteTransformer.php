<?php

namespace App\Transformers;

use App\Entities\ProjectNote;
use League\Fractal\TransformerAbstract;

class ProjectNoteTransformer extends TransformerAbstract
{

    public function transform(ProjectNote $model)
    {
        return [
            'id' => $model->id,
            'title' => $model->title,
            'note' => $model->note,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }

}
