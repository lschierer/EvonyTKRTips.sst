use 5.;
use strict;
use warnings;
use Module::Build;
Module::Build->VERSION('0.4004');

my $builder = Module::Build->new(
    module_name         => 'General',
    license             => 'CC_BY_4_0',
    dist_author         => q{ Luke Schierer <luke@schierer.org>},
    dist_version_from   => 'lib/General.pm',
    release_status      => 'unstable',
    configure_requires => {
        'Module::Build' => '0.4004',
    },
    test_requires => {
        'Test::More' => '0',
    },
    requires => {
        'Data::ULID'        => '1.3',
        'JSON'              => '4.10',
        'Cpanel::JSON::XS'  => '4.38',
        'JSON::MaybeXS'     => '1.004005',
    },
    add_to_cleanup     => [ 'EvonyPerl-*' ],
);

$builder->create_build_script();
